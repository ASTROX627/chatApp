"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const i18nHelper_1 = require("../utils/i18nHelper");
// REGISTER_CONTROLLER
const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.passwordMismatch") });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.passwordMinLength") });
            return;
        }
        const user = await user_model_1.default.findOne({ username });
        if (user) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.userExists") });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePicture = `https://avatar.iran.liara.run/public/girl/?username=${username}`;
        const newUser = new user_model_1.default({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePicture: gender === "male" ? boyProfilePicture : girlProfilePicture
        });
        if (newUser) {
            await newUser.save();
            res.status(201).json({
                message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.registrationSuccessful"),
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    profilePicture: newUser.profilePicture
                }
            });
        }
        else {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.invalidUserData") });
        }
    }
    catch (error) {
        console.log("error in register controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.register = register;
// LOGIN_CONTROLLER
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.allFieldsRequired") });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.passwordMinLength") });
        }
        const user = await user_model_1.default.findOne({ username });
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            res.status(400).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.invalidCredentials") });
            return;
        }
        (0, generateToken_1.default)(user._id, res);
        res.status(200).json({
            message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.loginSuccessful"),
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                gender: user.gender,
                profilePicture: user.profilePicture
            }
        });
    }
    catch (error) {
        console.log("Error in login controller.", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.login = login;
// LOGOUT_CONTROLLER
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ message: (0, i18nHelper_1.getLocalizedMessage)(req, "success.logoutSuccessful") });
    }
    catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: (0, i18nHelper_1.getLocalizedMessage)(req, "errors.internalServerError") });
    }
};
exports.logout = logout;
