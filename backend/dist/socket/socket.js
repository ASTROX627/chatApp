"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const group_model_1 = __importDefault(require("../models/group.model"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["*"],
        credentials: true,
        methods: ["GET", "POST"]
    }
});
exports.io = io;
const userSocketMap = {};
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
io.on('connection', (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        group_model_1.default.find({ "members.user": userId }).then(groups => {
            groups.forEach(group => {
                socket.join(group._id.toString());
            });
        });
    }
    io.emit("getOnlineUser", Object.keys(userSocketMap));
    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
        const userIdToRemove = Object.keys(userSocketMap).find((key) => userSocketMap[key] === socket.id);
        if (userIdToRemove) {
            delete userSocketMap[userIdToRemove];
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });
});
