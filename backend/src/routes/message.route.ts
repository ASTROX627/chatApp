import express from "express"
import { getMessage, sendMessage } from "../controllers/message.controller";
import upload from "../utils/upload"

const router = express.Router();

router.post("/send/:id", upload.single("file"), sendMessage);
router.get("/:id", getMessage);

export default router;