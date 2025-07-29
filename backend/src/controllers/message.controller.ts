import { Request, Response } from "express"
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import mongoose from "mongoose";
import { getLocalizedMessage } from "../utils/i18nHelper";
import { detectUrl } from "../utils/detectUrl";


export interface AuthenticatedRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    fullName: string;
    username: string;
    gender: "male" | "female";
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
  } | null
}

// SEND_MESSAGE_CONTROLLER
export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    const file = req.file

    if (!message && !file) {
      res.status(400).json({ error: getLocalizedMessage(req, "messageRequired") });
      return
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    let messageType = "text";
    let fileUrl = '';
    let fileName = '';
    let fileSize = 0;
    let fileMimeType = '';

    if (file) {
      fileUrl = `/uploads/${file.filename}`;
      fileName = file.originalname;
      fileSize = file.size;
      fileMimeType = file.mimetype;

      if (file.mimetype.startsWith("image/")) {
        messageType = "image";
      } else {
        messageType = "file"
      }
    } else if (message && detectUrl(message)) {
      messageType = "link"
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || "",
      messageType,
      fileUrl,
      fileSize,
      fileName,
      fileMimeType
    })

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await conversation.save();
    await newMessage.save();

    res.status(201).json({
      message: getLocalizedMessage(req, "success.messageSendSuccessful"),
      newMessage
    });

  } catch (error) {
    console.log("Erorr in send message controller", error);
    res.status(500).json({ erorr: getLocalizedMessage(req, "errors.internalServerError") })
  }
}

// GET_MESSAGE_CONTROLLER
export const getMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: userTochatId } = req.params;
    const senderId = req.user?._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userTochatId] }
    }).populate("messages");

    if (!conversation) {
      res.status(200).json({
        message: getLocalizedMessage(req, "errors.noConversation"),
        messages: []
      });
      return
    }

    const messages = conversation?.messages;

    res.status(200).json({
      message: getLocalizedMessage(req, "success.messageGaveSuccessful"),
      messages
    })
  } catch (error) {
    console.log("Erorr in get message controller", error);
    res.status(500).json({ erorr: getLocalizedMessage(req, "errors.internalServerError") })
  }
}