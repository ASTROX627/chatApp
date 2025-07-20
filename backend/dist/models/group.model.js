"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const groupSchema = new mongoose_1.default.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    groupType: {
        type: String,
        enum: ["group", "channel"],
        required: true
    },
    groupImage: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    admins: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    members: [{
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["admin", "member"],
                default: "member"
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }],
    messages: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "GroupMessage"
        }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    inviteCode: {
        type: String,
        unique: true
    },
    settings: {
        onlyAdminsCanPost: {
            type: Boolean,
            default: false
        },
        onlyAdminsCanAddMembers: {
            type: Boolean,
            default: false
        },
    }
}, { timestamps: true });
const Group = mongoose_1.default.model("Group", groupSchema);
exports.default = Group;
