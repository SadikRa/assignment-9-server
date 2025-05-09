"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginUser), auth_controller_1.AuthController.loginUser);
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.registerUser), auth_controller_1.AuthController.registerUser);
router.get("/me", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.COMPANY, client_1.Role.USER), auth_controller_1.AuthController.getMyProfile);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
router.post("/change-password", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.COMPANY, client_1.Role.USER), (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePassword), auth_controller_1.AuthController.changePassword);
router.post("/forgot-password", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.forgotPassword), auth_controller_1.AuthController.forgetPassword);
router.post("/reset-pass", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.resetPassword), auth_controller_1.AuthController.resetPassword);
exports.authRouter = router;
