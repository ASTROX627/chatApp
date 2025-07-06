import { Request, Response } from "express"
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import mongoose from "mongoose";


export interface AuthenticatedRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId
    fullName: string;
    username: string;
    gender: "male" | "female";
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
  } | null
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    })

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await conversation.save();
    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      newMessage
    });

  } catch (error) {
    console.log("Erorr in send message controller", error);
    res.status(500).json({ erorr: "Internal server error" })
  }
}

export const getMessage = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {id: userTochatId} = req.params;
    const senderId = req.user?._id;
    const conversation = await Conversation.findOne({
      participants: {$all: [senderId, userTochatId]}
    }).populate("messages");

    if(!conversation){
      res.status(200).json([]);
    }

    const messages = conversation?.messages;

    res.status(200).json({
      message: "Messages gave successfully",
      messages
    })
  } catch (error) {
    console.log("Erorr in get message controller", error);
    res.status(500).json({ erorr: "Internal server error" })
  }
}