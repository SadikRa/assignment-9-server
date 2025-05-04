// src/app/modules/user/user.routes.ts
import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import fileUploader from "../../../helpers/fileUploader";

const router = express.Router();

router.get("/", auth("ADMIN"), UserController.getAllUsers);

router.get("/my-profile", auth(), UserController.getMyProfile);

router.patch(
  "/my-profile",
  auth(),
  fileUploader.single("file"),
  validateRequest(userValidation.updateUser),
  UserController.updateMyProfile
);

router.delete("/my-profile", auth(), UserController.deleteMyProfile);

export const UserRoutes = router;
