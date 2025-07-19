"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGroup = exports.getPublicGroups = exports.createGroup = void 0;
const group_model_1 = __importDefault(require("../models/group.model"));
const group_utils_1 = require("../utils/group.utils");
const i18nHelper_1 = require("../utils/i18nHelper");
// CREATE_GROUP_CONTROLLER
const createGroup = async (req, res) => {
    try {
        const { groupName, groupType, isPrivate, onlyAdminCanPost, onlyAdminsCanAddMembers } = req.body;
        const ownerId = req.user?._id;
        if (!groupName || !groupType) {
            res.status(400).json({ error: "name and type is required" });
            return;
        }
        if (!["group", "channel"].includes(groupType)) {
            res.status(400).json({ error: "invalid type for group" });
            return;
        }
        if (!ownerId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const inviteCode = (0, group_utils_1.generateInviteCode)();
        const admins = (0, group_utils_1.getAllAdmins)(ownerId, []);
        const profilePicture = groupType === "group" ? `https://avatar.iran.liara.run/public/group?name=${groupName}` : `https://avatar.iran.liara.run/public/channel?name=${groupName}`;
        let finalOnlyAdminCanPost;
        let finalOnlyAdminsCanAddMembers;
        if (groupType === "channel") {
            finalOnlyAdminCanPost = true;
            finalOnlyAdminsCanAddMembers = true;
        }
        else if (groupType === "group") {
            finalOnlyAdminCanPost = false;
            finalOnlyAdminsCanAddMembers = false;
        }
        else {
            finalOnlyAdminCanPost = onlyAdminCanPost || false;
            finalOnlyAdminsCanAddMembers = onlyAdminsCanAddMembers || false;
        }
        const newGroup = new group_model_1.default({
            groupName,
            groupType,
            groupImage: profilePicture,
            owner: ownerId,
            admins: admins,
            members: [{
                    user: ownerId,
                    role: "admin",
                    joinedAt: new Date(),
                }],
            isPrivate: isPrivate || false,
            inviteCode: inviteCode,
            settings: {
                onlyAdminsCanPost: finalOnlyAdminCanPost,
                onlyAdminsCanAddMembers: finalOnlyAdminsCanAddMembers
            }
        });
        await newGroup.save();
        res.status(201).json({
            message: "group create successfully",
            group: newGroup
        });
    }
    catch (error) {
        console.log("Error in create group controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createGroup = createGroup;
// GET_PUBLIC_GROUP_CONTROLLER
const getPublicGroups = async (req, res) => {
    try {
        const allGroups = await group_model_1.default.find({ isPrivate: false }).select("-settings")
            .populate("owner", "username profilePicture")
            .populate("admins", "username profilePicture")
            .populate("members.user", "username profilePicture");
        res.status(200).json(allGroups);
    }
    catch (error) {
        console.log("Error in get groups controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getPublicGroups = getPublicGroups;
// GET_USER_GROUP_CONTROLLER
const getUserGroup = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userGroup = await group_model_1.default.find({ "members.user": userId }).select("-settings")
            .populate("owner", "username profilePicture")
            .populate("admins", "username profilePicture")
            .populate("members.user", "username profilePicture");
        res.status(200).json(userGroup);
    }
    catch (error) {
        console.log("Error in get groups controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getUserGroup = getUserGroup;
