import { Response } from "express"
import { AuthenticatedRequest } from "./message.controller"
import { getLocalizedMessage } from "../utils/i18nHelper";
import User from "../models/user.model";
import Group from "../models/group.model";

// GET_USER_PROFILE
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?._id;

    if (!userId) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.userIdRequired") });
      return;
    }

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.userNotFound") });
      return;
    }

    const userGroups = await Group.find({ "members.user": userId })
      .select("groupName groupImage groupType")

    let commonGroups = [];
    if (currentUserId && currentUserId.toString() !== userId) {
      commonGroups = await Group.find({
        $and: [
          { "members.user": userId },
          { "members.user": currentUserId }
        ]
      }).select("groupName groupImage groupType members admins owner")

    }

    res.status(200).json({
      message: getLocalizedMessage(req, "success.userProfileRetrieved"),
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
        groups: userGroups,
        commonGroups: commonGroups
      }
    });

  } catch (error) {
    console.log("Error in get user profile controller");
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}

// GET_GROUP_CONTROLLER
export const getGroupProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const currentUserId = req.user?._id;

    if (!groupId) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.groupIdRequired") })
      return;
    }

    const group = await Group.findById(groupId)
      .populate("owner", "username profilePicture fullname")
      .populate("admins", "username profilePicture fullname")
      .populate("members.user", "username profilePicture fullname");

    if (!group) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.groupNotFound") });
      return;
    }

    const isMember = group?.members.some(member => member.user?._id.toString() === currentUserId?.toString());
    const isOwner = group.owner._id.toString() === currentUserId?.toString();
    const isAdmin = group?.admins.some(admin => admin._id.toString() === currentUserId?.toString());

    if (!isMember && group?.isPrivate) {
      res.status(403).json({ error: getLocalizedMessage(req, "errors.accessDenied") });
      return;
    }

    let inviteCode = undefined;
    let members = undefined;
    let inviteUrl = undefined

    if (!group.isPrivate) {
      inviteCode = group.inviteCode;
      inviteUrl = `${process.env.CLIENT_URL}/invite/${group.inviteCode}`;
    }

    members = group.members.map(member => ({
      user: member.user,
      role: member.role
    }))

    res.status(200).json({
      message: getLocalizedMessage(req, "success.groupProfileRetrieved"),
      group: {
        groupId: group._id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        groupType: group.groupType,
        owner: group.owner,
        admins: group.admins,
        members: members,
        isPrivate: group.isPrivate,
        inviteCode: inviteCode,
        inviteUrl: inviteUrl,
        settings: isOwner || isAdmin ? group.settings : undefined,
      }
    })

  } catch (error) {
    console.log("Error in get group profile controller");
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}