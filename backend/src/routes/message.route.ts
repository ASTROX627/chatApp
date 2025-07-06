import express from "express"
import { getMessage, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.post("/send/:id", sendMessage);
router.get("/:id", getMessage);

export default router;