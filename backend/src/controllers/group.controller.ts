import { Request, Response } from "express";
import Group from "../models/group.model";
import { AuthenticatedRequest } from "./message.controller";
import { generateInviteCode, getAllAdmins } from "../utils/group.utils";
import { getLocalizedMessage } from "../utils/i18nHelper";

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