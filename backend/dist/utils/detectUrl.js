"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectUrl = void 0;
const detectUrl = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(message);
};
exports.detectUrl = detectUrl;
