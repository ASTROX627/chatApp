"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const upload_1 = __importDefault(require("../utils/upload"));
const router = express_1.default.Router();
router.post("/send/:id", upload_1.default.single("file"), message_controller_1.sendMessage);
router.get("/:id", message_controller_1.getMessage);
exports.default = router;
