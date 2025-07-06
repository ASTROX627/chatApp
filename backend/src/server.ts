import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import usersRoute from "./routes/users.route";
import connectToMongoDB from "./db/connectToMongoDB";
import cors from "cors"
import protectRoute from "./middleware/protectRoute";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", protectRoute, messageRoute);
app.use("/api/users", usersRoute)

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server running on port ${PORT}`);
});