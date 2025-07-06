"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.sendMessage = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;
        let conversation = await conversation_model_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = await conversation_model_1.default.create({
                participants: [senderId, receiverId]
            });
        }
        const newMessage = new message_model_1.default({
            senderId,
            receiverId,
            message
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await conversation.save();
        await newMessage.save();
        res.status(201).json({
            message: "Message sent successfully",
            newMessage
        });
    }
    catch (error) {
        console.log("Erorr in send message controller", error);
        res.status(500).json({ erorr: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const getMessage = async (req, res) => {
    try {
        const { id: userTochatId } = req.params;
        const senderId = req.user?._id;
        const conversation = await conversation_model_1.default.findOne({
            participants: { $all: [senderId, userTochatId] }
        }).populate("messages");
        if (!conversation) {
            res.status(200).json([]);
        }
        const messages = conversation?.messages;
        res.status(200).json({
            message: "Messages gave successfully",
            messages
        });
    }
    catch (error) {
        console.log("Erorr in get message controller", error);
        res.status(500).json({ erorr: "Internal server error" });
    }
};
exports.getMessage = getMessage;
