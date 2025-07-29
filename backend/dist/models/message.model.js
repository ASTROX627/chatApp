"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
    },
    messageType: {
        type: String,
        enum: ["text", "file", "image", "document", "link", "invite"],
        default: "text"
    },
    fileUrl: {
        type: String
    },
    fileSize: {
        type: Number
    },
    fileName: {
        type: String
    },
    fileMimeType: {
        type: String
    },
    linkMetaData: {
        title: String,
        description: String,
        favicon: String,
        domain: String
    },
    inviteData: {
        groupId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Group"
        },
        groupName: String,
        groupType: {
            type: String,
            enum: ["group", "channel"]
        },
        inviteCode: String,
        inviteUrl: String
    }
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
