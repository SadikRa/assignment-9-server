"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const fileUploader_1 = __importDefault(require("../../../helpers/fileUploader"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", user_controller_1.UserController.getAllUsers);
router.get("/my-profile/:id", user_controller_1.UserController.getMyProfile);
router.get("/:email", user_controller_1.UserController.getAnAccountByEmail);
router.patch("/make-admin/:id", user_controller_1.UserController.makeAdmin);
router.patch("/my-profile", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.USER), fileUploader_1.default.single("image"), (req, res, next) => {
    req.body = user_validation_1.userValidation.updateUser.parse(JSON.parse(req.body.data));
    user_controller_1.UserController.updateMyProfile(req, res, next);
});
router.delete("/my-profile", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.USER), user_controller_1.UserController.deleteMyProfile);
exports.UserRoutes = router;
