import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import fileUploader from "../../../helpers/fileUploader";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get("/my-profile/:id", UserController.getMyProfile);

router.patch(
  "/my-profile/:id",
  auth(Role.ADMIN, Role.USER),
  fileUploader.single("file"),
  validateRequest(userValidation.updateUser),
  UserController.updateMyProfile
);

router.delete("/my-profile", auth(), UserController.deleteMyProfile);

export const UserRoutes = router;
