"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupProfile = exports.getUserProfile = void 0;
const i18nHelper_1 = require("../utils/i18nHelper");
const user_model_1 = __importDefault(require("../models/user.model"));
const group_model_1 = __importDefault(require("../models/group.model"));
// GET_USER_PROFILE
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?._id;
        if (!userId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.userIdRequired") });
            return;
        }
        const user = await user_model_1.default.findById(userId)
            .select("-password");
        if (!user) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.userNotFound") });
            return;
        }
        const userGroups = await group_model_1.default.find({ "members.user": userId })
            .select("groupName groupImage groupType");
        let commonGroups = [];
        if (currentUserId && currentUserId.toString() !== userId) {
            commonGroups = await group_model_1.default.find({
                $and: [
                    { "members.user": userId },
                    { "members.user": currentUserId }
                ]
            }).select("groupName groupImage groupType members admins owner");
        }
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.userProfileRetrieved"),
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePicture: user.profilePicture,
                groups: userGroups,
                commonGroups: commonGroups
            }
        });
    }
    catch (error) {
        console.log("Error in get user profile controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getUserProfile = getUserProfile;
// GET_GROUP_CONTROLLER
const getGroupProfile = async (req, res) => {
    try {
        const { groupId } = req.params;
        const currentUserId = req.user?._id;
        if (!groupId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupIdRequired") });
            return;
        }
        const group = await group_model_1.default.findById(groupId)
            .populate("owner", "username profilePicture fullname")
            .populate("admins", "username profilePicture fullname")
            .populate("members.user", "username profilePicture fullname");
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        const isMember = group?.members.some(member => member.user?._id.toString() === currentUserId?.toString());
        const isOwner = group.owner._id.toString() === currentUserId?.toString();
        const isAdmin = group?.admins.some(admin => admin._id.toString() === currentUserId?.toString());
        if (!isMember && group?.isPrivate) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.accessDenied") });
            return;
        }
        let inviteCode = undefined;
        let members = undefined;
        let inviteUrl = undefined;
        if (!group.isPrivate) {
            inviteCode = group.inviteCode;
            inviteUrl = `${process.env.CLIENT_URL}/invite/${group.inviteCode}`;
        }
        members = group.members.map(member => ({
            user: member.user,
            role: member.role
        }));
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.groupProfileRetrieved"),
            group: {
                groupId: group._id,
                groupName: group.groupName,
                groupImage: group.groupImage,
                groupType: group.groupType,
                owner: group.owner,
                admins: group.admins,
                members: members,
                isPrivate: group.isPrivate,
                inviteCode: inviteCode,
                inviteUrl: inviteUrl,
                settings: isOwner || isAdmin ? group.settings : undefined,
            }
        });
    }
    catch (error) {
        console.log("Error in get group profile controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getGroupProfile = getGroupProfile;
