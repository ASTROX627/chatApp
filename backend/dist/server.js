"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use("/api/auth", auth_route_1.default);
app.listen(PORT, () => {
    (0, connectToMongoDB_1.default)();
    console.log(`server runnig on port ${PORT}`);
});
