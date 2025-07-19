import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import usersRoute from "./routes/users.route";
import groupRoute from "./routes/group.route";
import connectToMongoDB from "./db/connectToMongoDB";
import cors from "cors"
import protectRoute from "./middleware/protectRoute";
import cookieParser from "cookie-parser";
import i8nextMiddleware from "i18next-http-middleware";
import i18next from "./core/i18n";
import path from "path"

const app = express();

dotenv.config();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(cookieParser());

app.use(i8nextMiddleware.handle(i18next))

app.use("/uploads", express.static(path.join(process.cwd(), "backend/uploads")));

app.get('/favicon.ico', (req, res) => {
  res.status(204).send();
});

app.use("/api/auth", authRoute);
app.use("/api/messages", protectRoute, messageRoute);
app.use("/api/users", usersRoute);
app.use("/api/group", protectRoute, groupRoute);


app.listen(PORT, '0.0.0.0',() => {
  connectToMongoDB();
  console.log(`server running on port ${PORT}`);
});