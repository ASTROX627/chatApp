import express from "express"
import protectRoute from "../middleware/protectRoute";
import { getGroupProfile, getUserProfile } from "../controllers/profile.controller";

const router = express.Router();

router.get("/user", protectRoute, getUserProfile);
router.get("/group", protectRoute, getGroupProfile);

export default router;

