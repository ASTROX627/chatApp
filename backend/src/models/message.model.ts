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
    enum: ["text", "file", "image", "document"],
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
  }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;