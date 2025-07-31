import express from "express"
import { createGroup, getGroupMessage, getPrivategroupByInvite, getPublicGroups, getUserGroup, joinGroup, sendGroupMessage, sendInvite } from "../controllers/group.controller";
import protectRoute from "../middleware/protectRoute";
import upload from "../utils/upload";

const router = express.Router();

router.post("/create", protectRoute, createGroup);

router.get("/", protectRoute, getPublicGroups);

router.get("/user", protectRoute, getUserGroup);

router.post("/send/:groupId", upload.single("file"), sendGroupMessage);

router.get("/messages/:groupId", protectRoute, getGroupMessage);

router.post("/join/:groupId", protectRoute, joinGroup);

router.post("/invite/:groupId", protectRoute, sendInvite);

router.get("/invite/:inviteCode", protectRoute, getPrivategroupByInvite);

export default router;