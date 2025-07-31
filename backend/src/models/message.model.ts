import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
  },
  messageType: {
    type: String,
    enum: ["text", "file", "image", "document", "link", "inviteLink"],
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
      type: mongoose.Schema.Types.ObjectId,
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

const Message = mongoose.model("Message", messageSchema);

export default Message;