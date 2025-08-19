"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kikUser = exports.demoteUser = exports.promoteUsers = exports.leaveGroup = exports.getPrivategroupByInvite = exports.sendInvite = exports.joinGroup = exports.getGroupMessage = exports.sendGroupMessage = exports.getUserGroup = exports.getPublicGroups = exports.createGroup = void 0;
const group_model_1 = __importDefault(require("../models/group.model"));
const group_utils_1 = require("../utils/group.utils");
const i18nHelper_1 = require("../utils/i18nHelper");
const groupMessage_model_1 = __importDefault(require("../models/groupMessage.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const detectUrl_1 = require("../utils/detectUrl");
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("../socket/socket");
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
        const owner = await user_model_1.default.findById(ownerId);
        const groupCreatedMessage = new groupMessage_model_1.default({
            groupId: newGroup._id,
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "systemMessages.groupCreated", {
                groupName,
                performer: owner?.username || "Unknown"
            }),
            messageType: "system",
            systemMessageType: "group_created",
            senderId: ownerId
        });
        await groupCreatedMessage.save();
        newGroup.messages.push(groupCreatedMessage._id);
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
        else if (message && (0, detectUrl_1.detectUrl)(message)) {
            messageType = "link";
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
        socket_1.io.to(groupId).emit("newGroupMessage", newGroupMessage);
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
    try {
        const { groupId } = req.params;
        const userId = req.user?._id;
        if (!groupId) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "erorrs.groupRequired") });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.unauthorized") });
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
        if (group.isPrivate) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.onlyWithInvite") });
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
        const user = await user_model_1.default.findById(userId);
        const userJoinedMessage = new groupMessage_model_1.default({
            groupId: group._id,
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "systemMessages.userJoined", {
                username: user?.username || "Unknown",
            }),
            messageType: "system",
            systemMessageType: "user_joined",
            senderId: userId
        });
        await userJoinedMessage.save();
        group.messages.push(userJoinedMessage._id);
        await group.save();
        socket_1.io.to(groupId).emit("newGroupMessage", userJoinedMessage);
        socket_1.io.to(groupId).emit("groupUpdated", {
            groupId: group._id,
            members: group.members,
            memberCount: group.members.length,
            newMember: newMember
        });
    }
    catch (error) {
        console.log("Error in join group controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.joinGroup = joinGroup;
// SEND_INVITE_CONTROLELR
const sendInvite = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { invitedId } = req.body;
        const inviterId = req.user?._id;
        if (!groupId || !invitedId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        const group = await group_model_1.default.findById(groupId)
            .populate("owner", "username profilePicture")
            .populate("admins", "username profilePicture");
        const invited = await user_model_1.default.findById(invitedId);
        const isOwner = group?.owner._id.toString() === inviterId?.toString();
        const isAdmin = group?.admins.some(admin => admin.id.toString() === inviterId?.toString());
        const isMember = group?.members.some(member => member.user?._id === invitedId);
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        if (!invited) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.userNotFoud") });
            return;
        }
        if (!isOwner && !isAdmin) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.onlyAdmins") });
            return;
        }
        if (isMember) {
            res.status(400).json({ errors: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.isAlreadyJoined") });
            return;
        }
        const inviteUrl = `${process.env.CLIENT_URL}/invite/${group.inviteCode}`;
        let conversation = await conversation_model_1.default.findOne({
            participants: { $all: [inviterId, invitedId] }
        });
        if (!conversation) {
            conversation = await conversation_model_1.default.create({
                participants: [inviterId, invitedId]
            });
        }
        const newInviteMessage = new message_model_1.default({
            senderId: inviterId,
            receiverId: invitedId,
            message: inviteUrl,
            messageType: "inviteLink",
            inviteData: {
                groupId: group._id,
                groupName: group.groupName,
                groupImage: group.groupImage,
                groupType: group.groupType,
                inviteCode: group.inviteCode,
                inviteUrl: inviteUrl
            }
        });
        await newInviteMessage.save();
        conversation.messages.push(newInviteMessage.id);
        await conversation.save();
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.inviteSuccessful"),
            inviteData: {
                groupName: group.groupName,
                groupType: group.groupType,
                groupImage: group.groupImage,
                inviteCode: group.inviteCode,
                inviter: req.user?.username,
                invited: invited.username,
                inviteUrl: inviteUrl
            },
            messageInfo: {
                messageId: newInviteMessage.id,
                conversationId: conversation.id
            }
        });
    }
    catch (error) {
        console.log("Error in send invite controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.sendInvite = sendInvite;
// GET_PRIVATE_GROUP_BY_INVITE
const getPrivategroupByInvite = async (req, res) => {
    try {
        const { inviteCode } = req.params;
        if (!inviteCode) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.inviteCodeRequired") });
            return;
        }
        const group = await group_model_1.default.findOne({ inviteCode })
            .populate("owner", "username profilePicture")
            .populate("admins", "username profilePicture")
            .populate("members.user", "username profilePicture");
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.groupFound"),
            group: {
                _id: group._id,
                groupName: group.groupName,
                groupImage: group.groupImage,
                groupType: group.groupType,
                owner: group.owner,
                admins: group.admins,
                members: group.members,
            }
        });
    }
    catch (error) {
        console.log("Error in get private group by invite controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getPrivategroupByInvite = getPrivategroupByInvite;
// LEAVE_GROUP_CONTROLLER
const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user?._id;
        if (!groupId) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupRequired") });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.unauthorized") });
            return;
        }
        const group = await group_model_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        const isOwner = group.owner.toHexString() === userId.toString();
        if (isOwner) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.canNotLeave") });
            return;
        }
        const memberIndex = group.members.findIndex(member => member.user?.toString() === userId.toString());
        if (memberIndex === -1) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.notMember") });
            return;
        }
        const currentMember = group.members[memberIndex];
        group.members.splice(memberIndex, 1);
        const adminIndex = group.admins.findIndex(adminId => adminId.toString() === userId.toString());
        if (adminIndex !== -1) {
            group.admins.splice(adminIndex, 1);
        }
        await group.save();
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.leaveSuccessfull"),
            leftMember: {
                user: currentMember.user,
                role: currentMember.role
            }
        });
        const user = await user_model_1.default.findById(userId);
        const userLeftGroupMessage = new groupMessage_model_1.default({
            groupId: group._id,
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "systemMessages.userLeft", {
                username: user?.username || "Unknown"
            }),
            messageType: "system",
            systemMessageType: "user_left",
            senderId: userId
        });
        await userLeftGroupMessage.save();
        group.messages.push(userLeftGroupMessage._id);
        await group.save();
        socket_1.io.to(groupId).emit("newGroupMessage", userLeftGroupMessage);
        socket_1.io.to(groupId).emit("groupUpdated", {
            admins: group.admins,
            members: group.members,
            memberCount: group.members.length,
            leftMember: {
                user: currentMember.user,
                role: currentMember.role
            }
        });
    }
    catch (error) {
        console.log("Error in leave group controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.leaveGroup = leaveGroup;
// PROMOTE_USERS_CONTROLLER
const promoteUsers = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const promoterId = req.user?._id;
        if (!groupId || !userId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        const group = await group_model_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        const isOwner = group.owner.toString() === promoterId?.toString();
        const isAdmin = group.admins.some(adminId => adminId.toString() === promoterId?.toString());
        if (!isOwner && !isAdmin) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.onlyAdmins") });
            return;
        }
        const memberIndex = group.members.findIndex(member => member.user?.toString() === userId.toString());
        if (memberIndex === -1) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.notMember") });
            return;
        }
        const promotedMember = group.members[memberIndex];
        if (promotedMember.role === "admin") {
            res.status(400).json({ erorr: (0, i18nHelper_1.getLocalizedMessage)(req, "erorrs.alreadyAdmin") });
            return;
        }
        promotedMember.role = "admin";
        group.admins.push(new mongoose_1.default.Types.ObjectId(userId));
        await group.save();
        await group.populate([
            { path: "owner", select: "username profilePicture" },
            { path: "admins", select: "username profilePicture" },
            { path: "members.user", select: "username profilePicture" },
        ]);
        res.status(200).json({
            massage: (0, i18nHelper_1.getLocalizedMessage)(req, "success.userPromoted"),
            promotedUser: {
                user: promotedMember.user
            }
        });
        const promoter = await user_model_1.default.findById(promoterId);
        const user = await user_model_1.default.findById(userId);
        const promotedUserMessage = new groupMessage_model_1.default({
            groupId: group._id,
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "systemMessages.userPromoted", {
                username: user?.username || "Unknown",
                performer: promoter?.username || "Unknown"
            }),
            messageType: "system",
            systemMessageType: "user_promoted",
            senderId: promoterId
        });
        const promotedSocketId = (0, socket_1.getReceiverSocketId)(userId);
        if (promotedSocketId) {
            socket_1.io.to(promotedSocketId).emit("roleUpdated", {
                groupId: group._id,
                newRole: "admin"
            });
        }
        socket_1.io.to(groupId).emit("newGroupMessage", promotedUserMessage);
        socket_1.io.to(groupId).emit("groupUpdated", {
            groupId: group._id,
            members: group.members,
            admins: group.admins,
            promoteUser: {
                user: promotedMember.user,
                newRole: "admin"
            }
        });
        await promotedUserMessage.save();
        group.messages.push(promotedUserMessage._id);
        await group.save();
    }
    catch (error) {
        console.log("Error in promote users controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.promoteUsers = promoteUsers;
// DEMOTE_USER_CONTROLLER
const demoteUser = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const demoterId = req.user?._id;
        if (!groupId || !userId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        const group = await group_model_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        const isOwner = group.owner.toString() === demoterId?.toString();
        if (!isOwner) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.onlyOwner") });
            return;
        }
        const memberIndex = group.members.findIndex(member => member.user?.toString() === userId.toString());
        if (memberIndex === -1) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.notMember") });
            return;
        }
        const demotedMember = group.members[memberIndex];
        if (demotedMember.role === "member") {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.alreadyMember") });
            return;
        }
        demotedMember.role = "member";
        group.admins = group.admins.filter(adminId => adminId.toString() !== userId);
        await group.save();
        await group.populate([
            { path: "owner", select: "username profilePicture" },
            { path: "admins", select: "username profilePicture" },
            { path: "members.user", select: "username profilePicture" },
        ]);
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.userDemoted"),
            demotedUser: {
                user: demotedMember.user
            }
        });
        const demoter = await user_model_1.default.findById(demoterId);
        const user = await user_model_1.default.findById(userId);
        const demotedUserMessage = new groupMessage_model_1.default({
            groupId: group._id,
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "systemMessages.userDemoted", {
                username: user?.username || "Unknown",
                performer: demoter?.username || "Unknown"
            }),
            messageType: "system",
            systemMessageType: "user_demoted",
            senderId: demoterId
        });
        await demotedUserMessage.save();
        group.messages.push(demotedUserMessage._id);
        await group.save();
        const demotedSocketId = (0, socket_1.getReceiverSocketId)(userId);
        if (demotedSocketId) {
            socket_1.io.to(demotedSocketId).emit("roleUpdated", {
                groupId: group._id,
                newRole: "member"
            });
        }
        socket_1.io.to(groupId).emit("newGroupMessage", demotedUserMessage);
        socket_1.io.to(groupId).emit("groupUpdated", {
            groupId: group._id,
            admins: group.admins,
            members: group.members,
            demotedUser: {
                user: demotedMember.user,
                newRole: "member"
            }
        });
    }
    catch (error) {
        console.log("Error in demote user controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.demoteUser = demoteUser;
// KICK_USER_CONTROLLER
const kikUser = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const kickerId = req.user?._id;
        if (!groupId || !userId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        const group = await group_model_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.groupNotFound") });
            return;
        }
        const isOwner = group.owner.toString() === kickerId?.toString();
        const isAdmin = group.admins.some(adminId => adminId.toString() === kickerId?.toString());
        if (!isOwner && isAdmin) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.onlyAdmins") });
            return;
        }
        const memberIndex = group.members.findIndex(member => member.user?.toString() === userId);
        if (memberIndex === -1) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.notMember") });
            return;
        }
        const kickedMember = group.members[memberIndex];
        if (kickedMember.role === "admin" && !isOwner) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.canNotKick") });
            return;
        }
        if (group.owner.toString() === userId.toString()) {
            res.status(403).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.canNotKickOwner") });
            return;
        }
        group.members.splice(memberIndex, 1);
        group.admins = group.admins.filter(adminId => adminId.toString() !== userId);
        await group.save();
        await group.populate([
            { path: "owner", select: "username profilePicture" },
            { path: "admins", select: "username profilePicture" },
            { path: "members.user", select: "username profilePicture" },
        ]);
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.userKicked"),
            kickedMember: {
                user: kickedMember.user,
                role: kickedMember.role,
            }
        });
        const kicker = await user_model_1.default.findById(kickerId);
        const user = await user_model_1.default.findById(userId);
        const kickedUserMessage = new groupMessage_model_1.default({
            groupId: group._id,
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "systemMessages.userRemoved", {
                username: user?.username || "Unknown",
                performer: kicker?.username || "Unknown"
            }),
            messageType: "system",
            systemMessageType: "user_removed",
            senderId: kickerId
        });
        await kickedUserMessage.save();
        group.messages.push(kickedUserMessage._id);
        await group.save();
        socket_1.io.to(groupId).emit("newGroupMessage", kickedUserMessage);
        socket_1.io.to(groupId).emit("groupUpdated", {
            groupId: group.id,
            members: group.members,
            admins: group.admins,
            memberCount: group.members.length,
            kickedUser: {
                user: kickedMember.user
            }
        });
        const kickedUserSocketId = (0, socket_1.getReceiverSocketId)(userId);
        if (kickedUserSocketId) {
            socket_1.io.sockets.sockets.get(kickedUserSocketId)?.leave(groupId);
            socket_1.io.to(kickedUserSocketId).emit("kickedFromGroup", {
                groupId: group._id
            });
        }
    }
    catch (error) {
        console.log("Error in kick user controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.kikUser = kikUser;
