"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const i18nHelper_1 = require("../utils/i18nHelper");
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.unauthorized") });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.jwtSecretNotConfigured") });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.userId) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.invalidToken") });
            return;
        }
        const user = await user_model_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(404).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.userNotFound") });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protect route", error);
        res.status(500).json({ erorr: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.default = protectRoute;
