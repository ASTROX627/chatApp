import express from "express"
import protectRoute from "../middleware/protectRoute";
import { getFile } from "../controllers/file.controller";

const router = express.Router();

router.get("/message/:messageId", protectRoute, getFile)

export default router;