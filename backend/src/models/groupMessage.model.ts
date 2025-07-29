import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
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

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;