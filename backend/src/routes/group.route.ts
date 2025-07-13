import express from "express"
import { createGroup } from "../controllers/group.controller";

const router = express.Router();

router.post("/create", createGroup);

export default router;