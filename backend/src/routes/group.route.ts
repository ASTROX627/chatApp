import express from "express"
import { createGroup, getGroupMessage, getPublicGroups, getUserGroup, joinByInvite, joinGroup, sendGroupMessage, sendInvite } from "../controllers/group.controller";
import protectRoute from "../middleware/protectRoute";
import upload from "../utils/upload";

const router = express.Router();

router.post("/create", protectRoute, createGroup);

router.get("/", protectRoute, getPublicGroups);

router.get("/user", protectRoute, getUserGroup);

router.post("/send/:groupId", upload.single("file"), sendGroupMessage);

router.get("/:groupId", protectRoute, getGroupMessage);

router.post("/join/:groupId", protectRoute, joinGroup);

router.post("/invite/:groupId", protectRoute, sendInvite);

router.post("/join-invite/:inviteCode", protectRoute, joinByInvite);

export default router;