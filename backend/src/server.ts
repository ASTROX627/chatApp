import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route"
import connectToMongoDB from "./db/connectToMongoDB";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server runnig on port ${PORT}`);
});