"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = void 0;
const i18nHelper_1 = require("../utils/i18nHelper");
const message_model_1 = __importDefault(require("../models/message.model"));
const groupMessage_model_1 = __importDefault(require("../models/groupMessage.model"));
const getFile = async (req, res) => {
    try {
        const { messageId } = req.params;
        let message = await message_model_1.default.findById(messageId);
        let isGroupMessage = false;
        if (!message) {
            message = await groupMessage_model_1.default.findById(messageId);
            isGroupMessage = true;
        }
        if (!message || !message.fileData || !message.fileData.data || !message.fileData.contentType) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.fileNotFound") });
            return;
        }
        res.set("Content-Type", message.fileData.contentType);
        res.set("Content-Disposition", `inline; fileName="${message.fileName}"`);
        res.send(message.fileData.data);
    }
    catch (error) {
        console.log("error in get file controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getFile = getFile;
