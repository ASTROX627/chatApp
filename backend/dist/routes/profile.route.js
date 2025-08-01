"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const profile_controller_1 = require("../controllers/profile.controller");
const router = express_1.default.Router();
router.get("/user/:userId", protectRoute_1.default, profile_controller_1.getUserProfile);
router.get("/group/:groupId", protectRoute_1.default, profile_controller_1.getGroupProfile);
exports.default = router;
