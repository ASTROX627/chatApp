"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenAndSetCookies = (userId, res) => {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const token = jsonwebtoken_1.default.sign({ userId: userId.toString() }, secret, {
            expiresIn: "15d",
        });
        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
    }
};
exports.default = generateTokenAndSetCookies;
