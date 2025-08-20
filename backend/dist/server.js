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
const group_route_1 = __importDefault(require("./routes/group.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
const cors_1 = __importDefault(require("cors"));
const protectRoute_1 = __importDefault(require("./middleware/protectRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const i18n_1 = __importDefault(require("./core/i18n"));
const socket_1 = require("./socket/socket");
const file_route_1 = __importDefault(require("./routes/file.route"));
const seen_route_1 = __importDefault(require("./routes/seen.route"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 5000;
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(i18next_http_middleware_1.default.handle(i18n_1.default));
socket_1.app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", protectRoute_1.default, message_route_1.default);
socket_1.app.use("/api/users", users_route_1.default);
socket_1.app.use("/api/group", protectRoute_1.default, group_route_1.default);
socket_1.app.use("/api/profile", protectRoute_1.default, profile_route_1.default);
socket_1.app.use("/api/files", profile_route_1.default, file_route_1.default);
socket_1.app.use("/api/seen", profile_route_1.default, seen_route_1.default);
socket_1.server.listen(PORT, '0.0.0.0', () => {
    (0, connectToMongoDB_1.default)();
    console.log(`server running on port ${PORT}`);
});
