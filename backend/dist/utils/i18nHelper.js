"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalizedMessage = void 0;
const i18n_1 = __importDefault(require("../core/i18n"));
const getLocalizedMessage = (req, key) => {
    const language = req.headers[`accept-language`] || "en";
    return i18n_1.default.t(key, { lng: language });
};
exports.getLocalizedMessage = getLocalizedMessage;
