"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = async () => {
    try {
        if (process.env.MONGO_DB_URI) {
            await mongoose_1.default.connect(process.env.MONGO_DB_URI);
            console.log("connected to MongoDB");
        }
    }
    catch (error) {
        console.log("Error in connecting to MongoDB", error);
    }
};
exports.default = connectToMongoDB;
