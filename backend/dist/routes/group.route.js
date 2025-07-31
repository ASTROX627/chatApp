"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_controller_1 = require("../controllers/group.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const upload_1 = __importDefault(require("../utils/upload"));
const router = express_1.default.Router();
router.post("/create", protectRoute_1.default, group_controller_1.createGroup);
router.get("/", protectRoute_1.default, group_controller_1.getPublicGroups);
router.get("/user", protectRoute_1.default, group_controller_1.getUserGroup);
router.post("/send/:groupId", upload_1.default.single("file"), group_controller_1.sendGroupMessage);
router.get("/messages/:groupId", protectRoute_1.default, group_controller_1.getGroupMessage);
router.post("/join/:groupId", protectRoute_1.default, group_controller_1.joinGroup);
router.post("/invite/:groupId", protectRoute_1.default, group_controller_1.sendInvite);
router.get("/invite/:inviteCode", protectRoute_1.default, group_controller_1.getPrivategroupByInvite);
exports.default = router;
