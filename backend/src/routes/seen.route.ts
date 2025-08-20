import express from "express";
import protectRoute from "../middleware/protectRoute";
import { seenGroupMessage } from "../controllers/group.controller";
import { seenMessage } from "../controllers/message.controller";

const router = express.Router();

router.post("/message/:messageId", protectRoute, seenMessage);
router.post("/group-message/:messageId", protectRoute, seenGroupMessage);

export default router;