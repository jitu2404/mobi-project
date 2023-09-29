"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.default.Router();
userRouter.post("/login", user_controller_1.login);
userRouter.post("/signup", user_controller_1.signup);
userRouter.put("/update", auth_1.checkAuth, user_controller_1.update);
userRouter.get("/profile", auth_1.checkAuth, user_controller_1.profile);
exports.default = userRouter;
