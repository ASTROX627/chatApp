import { Server } from "socket.io";
import http from "http";
import express from "express"
import Group from "../models/group.model";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
}



io.on('connection', (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;

    Group.find({"members.user": userId}).then(groups => {
      groups.forEach(group => {
        socket.join(group._id.toString())
      })
    })
  }

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log("user disconnected", socket.id);

    const userIdToRemove = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (userIdToRemove) {
      delete userSocketMap[userIdToRemove];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  })
})

export { app, io, server }