"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupProfile = exports.getUserProfile = void 0;
const i18nHelper_1 = require("../utils/i18nHelper");
const user_model_1 = __importDefault(require("../models/user.model"));
// GET_USER_PROFILE
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.userIdRequired") });
            return;
        }
        const user = await user_model_1.default.findById(userId).se;
    }
    catch (error) {
        console.log("Error in get user profile controller");
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getUserProfile = getUserProfile;
// GET_GROUP_CONTROLLER
const getGroupProfile = () => {
    return;
};
exports.getGroupProfile = getGroupProfile;
