import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"]
  },
  profilePicture: {
    type: String,
    default: "",
  },
  groups: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;