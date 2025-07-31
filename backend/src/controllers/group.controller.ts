import { Request, Response } from "express";
import Group from "../models/group.model";
import { AuthenticatedRequest } from "./message.controller";
import { generateInviteCode, getAllAdmins } from "../utils/group.utils";
import { getLocalizedMessage } from "../utils/i18nHelper";
import GroupMessage from "../models/groupMessage.model";
import User from "../models/user.model";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { detectUrl } from "../utils/detectUrl";
import { error } from "console";

// CREATE_GROUP_CONTROLLER
export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupName, groupType, isPrivate, onlyAdminCanPost, onlyAdminsCanAddMembers } = req.body;
    const ownerId = req.user?._id;

    if (!groupName || !groupType) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.allFieldsRequired") });
      return;
    }

    if (!["group", "channel"].includes(groupType)) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.invalidGroupType") });
      return;
    }

    if (!ownerId) {
      res.status(401).json({ error: getLocalizedMessage(req, "errors.invalidToken") });
      return;
    }

    const inviteCode = generateInviteCode();
    const admins = getAllAdmins(ownerId, []);

    const profilePicture = groupType === "group" ? `https://avatar.iran.liara.run/public/group?name=${groupName}` : `https://avatar.iran.liara.run/public/channel?name=${groupName}`;

    let finalOnlyAdminCanPost: boolean;
    let finalOnlyAdminsCanAddMembers: boolean;

    if (groupType === "channel") {
      finalOnlyAdminCanPost = true;
      finalOnlyAdminsCanAddMembers = true;
    } else if (groupType === "group") {
      finalOnlyAdminCanPost = false;
      finalOnlyAdminsCanAddMembers = false;
    } else {
      finalOnlyAdminCanPost = onlyAdminCanPost || false;
      finalOnlyAdminsCanAddMembers = onlyAdminsCanAddMembers || false;
    }

    const newGroup = new Group({
      groupName,
      groupType,
      groupImage: profilePicture,
      owner: ownerId,
      admins: admins,
      members: [{
        user: ownerId,
        role: "admin",
        joinedAt: new Date(),
      }],
      isPrivate: isPrivate || false,
      inviteCode: inviteCode,
      settings: {
        onlyAdminsCanPost: finalOnlyAdminCanPost,
        onlyAdminsCanAddMembers: finalOnlyAdminsCanAddMembers
      }
    });

    await newGroup.save();

    res.status(201).json({
      message: getLocalizedMessage(req, "success.groupCreateSuccessful"),
      group: newGroup
    })

  } catch (error) {
    console.log("Error in create group controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") })
  }
}

// GET_PUBLIC_GROUP_CONTROLLER
export const getPublicGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const allGroups = await Group.find({ isPrivate: false }).select("-settings")
      .populate("owner", "username profilePicture")
      .populate("admins", "username profilePicture")
      .populate("members.user", "username profilePicture")

    res.status(200).json(allGroups)
  } catch (error) {
    console.log("Error in get groups controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") })
  }
}

// GET_USER_GROUP_CONTROLLER
export const getUserGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const userGroup = await Group.find({ "members.user": userId }).select("-settings")
      .populate("owner", "username profilePicture")
      .populate("admins", "username profilePicture")
      .populate("members.user", "username profilePicture")

    res.status(200).json(userGroup);
  } catch (error) {
    console.log("Error in get groups controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") })
  }
}

// SEND_GROUP_MESSAGES_CONTROLLER
export const sendGroupMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const { groupId } = req.params;
    const senderId = req.user?._id;
    const file = req.file;

    if (!groupId) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.groupRequired") });
      return;
    }

    if (!message && !file) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.messageRequired") });
      return;
    }

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.GroupNotFound") });
      return;
    }

    const isMember = group.members.some(member => member.user?.toString() === senderId?.toString());
    if (!isMember) {
      res.status(403).json({ error: getLocalizedMessage(req, "errors.notMember") });
      return;
    }

    if (group?.groupType === "channel" || group?.settings?.onlyAdminsCanPost) {
      const isOwner = group.owner.toString() === senderId?.toString();
      const isAdmin = group.admins.some(adminId => adminId.toString() === senderId?.toString());

      if (!isOwner && !isAdmin) {
        res.status(403).json({ error: getLocalizedMessage(req, "errors.onlyAdmins") });
        return;
      }
    }

    let messageType = "text";
    let fileUrl = "";
    let fileName = "";
    let fileSize = 0;
    let fileMimeType = "";

    if (file) {
      fileUrl = `/uploads/${file.filename}`;
      fileName = file.originalname;
      fileSize = file.size;
      fileMimeType = file.mimetype;

      if (file.mimetype.startsWith("image/")) {
        messageType = "image";
      } else {
        messageType = "file";
      }
    } else if (message && detectUrl(message)) {
      messageType = "link"
    }

    const newGroupMessage = new GroupMessage({
      senderId,
      groupId,
      message: message || "",
      messageType,
      fileUrl,
      fileSize,
      fileName,
      fileMimeType,
    });

    await newGroupMessage.save();

    await newGroupMessage.populate('senderId', 'username profilePicture');


    group.messages.push(newGroupMessage._id);
    await group.save();

    res.status(200).json({
      message: getLocalizedMessage(req, "success.messageSendSuccessful"),
      newGroupMessage,
    });

  } catch (error) {
    console.log("Error in send message group controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
};

//GET_GROUP_MESSAGE_CONTROLLER
export const getGroupMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;

    const groupMessages = await GroupMessage.find({ groupId })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: getLocalizedMessage(req, "success.messageGaveSuccessful"),
      groupMessages
    });

  } catch (error) {
    console.log("Error in get group message controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}

// JOIN_GROUP_CONTROLLER
export const joinGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

  try {
    const { groupId } = req.params;
    const userId = req.user?._id;

    if (!groupId) {
      res.status(404).json({ error: getLocalizedMessage(req, "erorrs.groupRequired") });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: getLocalizedMessage(req, "erros.unauthorized") });
      return;
    }

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.groupNotFound") });
      return;
    }

    const isMember = group.members.some(member => member.user?._id.toString() === userId.toString());

    if (isMember) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.isMember") });
      return;
    }

    if (group.isPrivate) {
      res.status(403).json({ error: getLocalizedMessage(req, "errors.onlyWithInvite") });
      return;
    }

    group.members.push({
      user: userId,
      role: "member",
      joinedAt: new Date()
    });

    await group.save();

    await group.populate([
      { path: "owner", select: "username profilePicture" },
      { path: "admins", select: "username profilePicture" },
      { path: "members.user", select: "username profilePicture" }
    ]);;

    const newMember = group.members.find(member => member.user?._id.toString() === userId.toString());

    res.status(200).json({
      message: getLocalizedMessage(req, "success.joinSuccessfull"),
      group: {
        _id: group._id,
        groupName: group.groupName,
        groupType: group.groupType,
        groupImage: group.groupImage,
        owner: group.owner,
        admins: group.admins,
        members: group.members,
        isPrivate: group.isPrivate,
        inviteCode: group.inviteCode,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      },
      newMember
    })

  } catch (error) {
    console.log("Error in join group controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}

// SEND_INVITE_CONTROLELR
export const sendInvite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { invitedId } = req.body;
    const inviterId = req.user?._id;

    if (!groupId || !invitedId) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.allFieldsRequired") });
      return;
    }

    const group = await Group.findById(groupId)
      .populate("owner", "username profilePicture")
      .populate("admins", "username profilePicture");

    const invited = await User.findById(invitedId);

    const isOwner = group?.owner._id.toString() === inviterId?.toString();
    const isAdmin = group?.admins.some(admin => admin.id.toString() === inviterId?.toString());
    const isMember = group?.members.some(member => member.user?._id === invitedId);

    if (!group) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.groupNotFound") });
      return;
    }

    if (!invited) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.userNotFoud") });
      return;
    }

    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: getLocalizedMessage(req, "errors.onlyAdmins") });
      return;
    }

    if (isMember) {
      res.status(400).json({ errors: getLocalizedMessage(req, "errors.isAlreadyJoined") });
      return;
    }

    const inviteUrl = `${process.env.CLIENT_URL}/invite/${group.inviteCode}`;


    let conversation = await Conversation.findOne({
      participants: { $all: [inviterId, invitedId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [inviterId, invitedId]
      })
    }

    const newInviteMessage = new Message({
      senderId: inviterId,
      receiverId: invitedId,
      message: inviteUrl,
      messageType: "inviteLink",
      inviteData: {
        groupId: group._id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        groupType: group.groupType,
        inviteCode: group.inviteCode,
        inviteUrl: inviteUrl
      }
    });

    await newInviteMessage.save();
    conversation.messages.push(newInviteMessage.id);
    await conversation.save();

    res.status(200).json({
      message: getLocalizedMessage(req, "success.inviteSuccessful"),
      inviteData: {
        groupName: group.groupName,
        groupType: group.groupType,
        groupImage: group.groupImage,
        inviteCode: group.inviteCode,
        inviter: req.user?.username,
        invited: invited.username,
        inviteUrl: inviteUrl
      },
      messageInfo: {
        messageId: newInviteMessage.id,
        conversationId: conversation.id
      }
    });


  } catch (error) {
    console.log("Error in send invite controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}

// GET_PRIVATE_GROUP_BY_INVITE
export const getPrivategroupByInvite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { inviteCode } = req.params;

    if (!inviteCode) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.inviteCodeRequired") });
      return;
    }

    const group = await Group.findOne({ inviteCode })
      .populate("owner", "username profilePicture")
      .populate("admins", "username profilePicture")
      .populate("members.user", "username profilePicture")

    if (!group) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.groupNotFound") });
      return;
    }

    res.status(200).json({
      message: getLocalizedMessage(req, "success.groupFound"),
      group: {
        _id: group._id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        groupType: group.groupType,
        owner: group.owner,
        admins: group.admins,
        members: group.members,
      }
    })
  } catch (error) {
    console.log("Error in get private group by invite controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}