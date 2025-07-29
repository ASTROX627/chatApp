"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const groupMessageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    groupId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    message: {
        type: String
    },
    messageType: {
        type: String,
        enum: ["text", "file", "image", "document", "link"],
        default: "text"
    },
    fileUrl: {
        type: String,
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
    systemMessageType: {
        type: String,
        enum: ["user_joined", "user_left", "user_added", "user_removed", "user_promoted", "user_demoted", "group_created"]
    }
}, { timestamps: true });
const GroupMessage = mongoose_1.default.model("GroupMessage", groupMessageSchema);
exports.default = GroupMessage;
