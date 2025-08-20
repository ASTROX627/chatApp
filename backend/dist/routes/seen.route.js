"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const group_controller_1 = require("../controllers/group.controller");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.post("/message/:messageId", protectRoute_1.default, message_controller_1.seenMessage);
router.post("/group-message/:messageId", protectRoute_1.default, group_controller_1.seenGroupMessage);
exports.default = router;
