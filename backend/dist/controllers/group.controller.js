"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinGroup = exports.getGroupMessage = exports.sendGroupMessage = exports.getUserGroup = exports.getPublicGroups = exports.createGroup = void 0;
const group_model_1 = __importDefault(require("../models/group.model"));
const group_utils_1 = require("../utils/group.utils");
const i18nHelper_1 = require("../utils/i18nHelper");
const groupMessage_model_1 = __importDefault(require("../models/groupMessage.model"));
// CREATE_GROUP_CONTROLLER
const createGroup = async (req, res) => {
    try {
        const { groupName, groupType, isPrivate, onlyAdminCanPost, onlyAdminsCanAddMembers } = req.body;
        const ownerId = req.user?._id;
        if (!groupName || !groupType) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        if (!["group", "channel"].includes(groupType)) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.invalidGroupType") });
            return;
        }
        if (!ownerId) {
            res.status(401).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.invalidToken") });
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
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.groupCreateSuccessful"),
            group: newGroup
        });
    }
    catch (error) {
        console.log("Error in create group controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
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
// SEND_GROUP_MESSAGES_CONTROLLER
const sendGroupMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { groupId } = req.params;
        const senderId = req.user?._id;
        const file = req.file;
        if (!groupId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupRequired") });
            return;
        }
        if (!message && !file) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.messageRequired") });
            return;
        }
        const group = await group_model_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.GroupNotFound") });
            return;
        }
        const isMember = group.members.some(member => member.user?.toString() === senderId?.toString());
        if (!isMember) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.notMember") });
            return;
        }
        if (group?.groupType === "channel" || group?.settings?.onlyAdminsCanPost) {
            const isOwner = group.owner.toString() === senderId?.toString();
            const isAdmin = group.admins.some(adminId => adminId.toString() === senderId?.toString());
            if (!isOwner && !isAdmin) {
                res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.onlyAdmins") });
                return;
            }
        }
        let messageType = "text";
        let fileUrl = "";
        let fileName = "";
        let fileSize = 0;
        let fileMimeType = "";
        if (file) {
            fileUrl = `/uploads/${file.filename}`;
            fileName = file.originalname;
            fileSize = file.size;
            fileMimeType = file.mimetype;
            if (file.mimetype.startsWith("image/")) {
                messageType = "image";
            }
            else {
                messageType = "file";
            }
        }
        const newGroupMessage = new groupMessage_model_1.default({
            senderId,
            groupId,
            message: message || "",
            messageType,
            fileUrl,
            fileSize,
            fileName,
            fileMimeType,
        });
        await newGroupMessage.save();
        await newGroupMessage.populate('senderId', 'username profilePicture');
        group.messages.push(newGroupMessage._id);
        await group.save();
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.messageSendSuccessful"),
            newGroupMessage,
        });
    }
    catch (error) {
        console.log("Error in send message group controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.sendGroupMessage = sendGroupMessage;
//GET_GROUP_MESSAGE_CONTROLLER
const getGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const groupMessages = await groupMessage_model_1.default.find({ groupId })
            .populate('senderId', 'username profilePicture')
            .sort({ createdAt: 1 });
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.messageGaveSuccessful"),
            groupMessages
        });
    }
    catch (error) {
        console.log("Error in get group message controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getGroupMessage = getGroupMessage;
// JOIN_GROUP_CONTROLLER
const joinGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user?._id;
    if (!groupId) {
        res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "erorrs.groupRequired") });
        return;
    }
    if (!userId) {
        res.status(401).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "erros.unauthorized") });
        return;
    }
    const group = await group_model_1.default.findById(groupId);
    if (!group) {
        res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
        return;
    }
    const isMember = group.members.some(member => member.user?._id.toString() === userId.toString());
    if (isMember) {
        res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.isMember") });
        return;
    }
    group.members.push({
        user: userId,
        role: "member",
        joinedAt: new Date()
    });
    await group.save();
    await group.populate([
        { path: "owner", select: "username profilePicture" },
        { path: "admins", select: "username profilePicture" },
        { path: "members.user", select: "username profilePicture" }
    ]);
    ;
    const newMember = group.members.find(member => member.user?._id.toString() === userId.toString());
    res.status(200).json({
        message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.joinSuccessfull"),
        group: {
            _id: group._id,
            groupName: group.groupName,
            groupType: group.groupType,
            groupImage: group.groupImage,
            owner: group.owner,
            admins: group.admins,
            members: group.members,
            isPrivate: group.isPrivate,
            inviteCode: group.inviteCode,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        },
        newMember
    });
};
exports.joinGroup = joinGroup;
// INVITE_USER_TO_GROUP
