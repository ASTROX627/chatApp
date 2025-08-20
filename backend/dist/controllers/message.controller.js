"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seenMessage = exports.getMessage = exports.sendMessage = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const i18nHelper_1 = require("../utils/i18nHelper");
const detectUrl_1 = require("../utils/detectUrl");
const socket_1 = require("../socket/socket");
// SEND_MESSAGE_CONTROLLER
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;
        const file = req.file;
        if (!message && !file) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "messageRequired") });
            return;
        }
        let conversation = await conversation_model_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = await conversation_model_1.default.create({
                participants: [senderId, receiverId]
            });
        }
        let messageType = "text";
        let fileData = null;
        let fileName = '';
        let fileSize = 0;
        let fileMimeType = '';
        if (file) {
            fileData = {
                data: file.buffer,
                contentType: file.mimetype
            };
            fileName = file.originalname;
            fileSize = file.size;
            fileMimeType = file.mimetype;
            if (file.mimetype.startsWith("image/")) {
                messageType = "image";
            }
            else {
                messageType = "file";
            }
        }
        else if (message && (0, detectUrl_1.detectUrl)(message)) {
            messageType = "link";
        }
        const newMessage = new message_model_1.default({
            senderId,
            receiverId,
            message: message || "",
            messageType,
            fileData,
            fileSize,
            fileName,
            fileMimeType
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await conversation.save();
        await newMessage.save();
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.messageSendSuccessful"),
            newMessage
        });
    }
    catch (error) {
        console.log("Erorr in send message controller", error);
        res.status(500).json({ erorr: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.sendMessage = sendMessage;
// GET_MESSAGE_CONTROLLER
const getMessage = async (req, res) => {
    try {
        const { id: userTochatId } = req.params;
        const senderId = req.user?._id;
        const conversation = await conversation_model_1.default.findOne({
            participants: { $all: [senderId, userTochatId] }
        }).populate("messages");
        if (!conversation) {
            res.status(200).json({
                message: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.noConversation"),
                messages: []
            });
            return;
        }
        const messages = conversation?.messages;
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.messageGaveSuccessful"),
            messages
        });
    }
    catch (error) {
        console.log("Erorr in get message controller", error);
        res.status(500).json({ erorr: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getMessage = getMessage;
// SEEN_MESSAGE_CONTROLLER
const seenMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user?._id;
        if (!messageId || !userId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        const message = await message_model_1.default.findById(messageId);
        if (!message) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.messageNotFound") });
            return;
        }
        if (message.receiverId.toString() !== userId.toString()) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.unauthorized") });
            return;
        }
        message.isSeen = true;
        await message.save();
        const senderSocketId = (0, socket_1.getReceiverSocketId)(message.senderId.toString());
        if (senderSocketId) {
            socket_1.io.to(senderSocketId).emit("messageSeen", { messageId });
        }
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.messageSeen")
        });
    }
    catch (error) {
        console.log("Error in seen message controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.seenMessage = seenMessage;
