import express from "express"
import { createGroup, getPublicGroups, getUserGroup } from "../controllers/group.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/create", protectRoute, createGroup);

router.get("/", protectRoute, getPublicGroups);

router.get("/user", protectRoute, getUserGroup);

export default router;