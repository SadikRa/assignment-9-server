import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { userValidation } from "./user.validation";
import fileUploader from "../../../helpers/fileUploader";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get("/my-profile/:id", UserController.getMyProfile);

router.patch("/make-admin/:id", UserController.makeAdmin);

router.patch(
  "/my-profile",
  auth(Role.ADMIN, Role.USER),
  fileUploader.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.updateUser.parse(JSON.parse(req.body.data));
    UserController.updateMyProfile(req, res, next);
  }
);

router.delete(
  "/my-profile",
  auth(Role.ADMIN, Role.USER),
  UserController.deleteMyProfile
);

export const UserRoutes = router;
