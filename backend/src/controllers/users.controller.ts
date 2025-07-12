import { Response } from "express";
import { AuthenticatedRequest } from "./message.controller";
import User from "../models/user.model";
import { getLocalizedMessage } from "../utils/i18nHelper";

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in get users controller", error);
    res.status(500).json({ erorr: getLocalizedMessage(req, "errors.internalServerError") })
  }
}