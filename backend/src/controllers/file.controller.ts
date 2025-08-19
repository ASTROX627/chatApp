import { Request, Response } from "express";
import { getLocalizedMessage } from "../utils/i18nHelper";
import Message from "../models/message.model";
import GroupMessage from "../models/groupMessage.model";

export const getFile = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    let message = await Message.findById(messageId);
    let isGroupMessage = false;

    if (!message) {
      message = await GroupMessage.findById(messageId);
      isGroupMessage = true;
    }

    if (!message || !message.fileData || !message.fileData.data || !message.fileData.contentType) {
      res.status(404).json({ error: getLocalizedMessage(req, "errors.fileNotFound") });
      return;
    }

    res.set("Content-Type", message.fileData.contentType);
    res.set("Content-Disposition", `inline; fileName="${message.fileName}"`);
    res.send(message.fileData.data)
  } catch (error) {
    console.log("error in get file controller");
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") });
  }
}