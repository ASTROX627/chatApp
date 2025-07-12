"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const i18nHelper_1 = require("../utils/i18nHelper");
const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user?._id;
        const filteredUsers = await user_model_1.default.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (error) {
        console.log("Error in get users controller", error);
        res.status(500).json({ erorr: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.getUsers = getUsers;
