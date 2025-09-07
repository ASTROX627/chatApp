import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import usersRoute from "./routes/users.route";
import groupRoute from "./routes/group.route";
import profileRoute from "./routes/profile.route";
import connectToMongoDB from "./db/connectToMongoDB";
import cors from "cors"
import protectRoute from "./middleware/protectRoute";
import cookieParser from "cookie-parser";
import i8nextMiddleware from "i18next-http-middleware";
import i18next from "./core/i18n";
import { app, server } from "./socket/socket";
import fileRoute from "./routes/file.route";
import seenRoute from "./routes/seen.route"
import path from "path";

dotenv.config();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(cookieParser());

app.use(i8nextMiddleware.handle(i18next))

app.get('/favicon.ico', (req, res) => {
  res.status(204).send();
});

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoute);
app.use("/api/messages", protectRoute, messageRoute);
app.use("/api/users", usersRoute);
app.use("/api/group", protectRoute, groupRoute);
app.use("/api/profile", protectRoute, profileRoute);
app.use("/api/files", profileRoute,  fileRoute);
app.use("/api/seen", profileRoute, seenRoute);


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
});


server.listen(PORT, '0.0.0.0',() => {
  connectToMongoDB();
  console.log(`server running on port ${PORT}`);
});