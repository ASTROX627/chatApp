"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
const cors_1 = __importDefault(require("cors"));
const protectRoute_1 = __importDefault(require("./middleware/protectRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_route_1.default);
app.use("/api/messages", protectRoute_1.default, message_route_1.default);
app.use("/api/users", users_route_1.default);
app.listen(PORT, () => {
    (0, connectToMongoDB_1.default)();
    console.log(`server running on port ${PORT}`);
});
