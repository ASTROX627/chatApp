import { Request, Response } from "express";
import Group from "../models/group.model";
import { AuthenticatedRequest } from "./message.controller";
import { generateInviteCode, getAllAdmins } from "../utils/group.utils";
import { getLocalizedMessage } from "../utils/i18nHelper";
import GroupMessage from "../models/groupMessage.model";

// CREATE_GROUP_CONTROLLER
export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupName, groupType, isPrivate, onlyAdminCanPost, onlyAdminsCanAddMembers } = req.body;
    const ownerId = req.user?._id;

    if (!groupName || !groupType) {
      res.status(400).json({ error: "name and type is required" });
      return;
    }

    if (!["group", "channel"].includes(groupType)) {
      res.status(400).json({ error: "invalid type for group" });
      return;
    }

    if (!ownerId) {
      res.status(401).json({ error: "Unauthorized" });
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
      message: "group create successfully",
      group: newGroup
    })

  } catch (error) {
    console.log("Error in create group controller", error);
    res.status(500).json({ error: "Internal server error" })

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
      res.status(400).json({ error: getLocalizedMessage(req, "GroupIdRequired") });
      return;
    }

    if (!message && !file) {
      res.status(400).json({ error: getLocalizedMessage(req, "messageRequired") });
      return;
    }

    const group = await Group.findById(groupId);

    if(group?.groupType === "channel" || group?.settings?.onlyAdminsCanPost){
      const isAdmin = group.admins.some(adminId => adminId.toString() === senderId?.toString());
      if(!isAdmin){
        res.status(403).json({error: getLocalizedMessage(req, "onlyAdmins")});
      }
    }

    if (!group) {
      res.status(404).json({ error: getLocalizedMessage(req, "GroupNotFound") });
      return;
    }

    const isMember = group.members.some(member => member.user?.id.toString() === senderId?.toString());

    if(!isMember){
        res.status(403).json({error: getLocalizedMessage(req, "notMember")});
    }

    let messageType = "text";
    let fileUrl = "";
    let fileName = "";
    let fileSize = 0;
    let fileMimeType = "";

    if (file) {
      fileUrl = `uploads/${file.filename}`;
      fileName = file.originalname;
      fileSize = file.size;
      fileMimeType = file.mimetype;

      if (file.mimetype.startsWith("image/")) {
        messageType = "image";
      } else {
        messageType = "file";
      }
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

    if (newGroupMessage) {
      console.log("newGroupMessage:", newGroupMessage);

    }

    group.messages.push(newGroupMessage._id);

    await group.save();
    await newGroupMessage.save();

    res.status(200).json({
      message: getLocalizedMessage(req, "success.messageSendSuccessful"),
      newGroupMessage,
    });

  } catch (error) {
    console.log("Erorr in send message group controller", error);
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