import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import fileUploader from "../../../helpers/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "@prisma/client";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = Router();

/// create review
router.post(
  "/create-review",
  auth(Role.USER, Role.COMPANY, Role.ADMIN),
  fileUploader.single("image"),
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview
);

// get all review
router.get("/", reviewController.getReview);

// get single review
router.get(
  "/:id",
  auth(Role.USER, Role.COMPANY, Role.ADMIN),
  reviewController.getAReview
);

/// update review
router.patch(
  "update-review/:id",
  auth(Role.COMPANY, Role.ADMIN),
  validateRequest(reviewValidation.updateReviewSchema),
  reviewController.updateAReview
);

router.delete(
  "delete-review/:id",
  auth(Role.COMPANY, Role.ADMIN),
  reviewController.deleteAReview
);

// // Premium review payment endpoint
// router.post(
//   '/:id/purchase',
//   auth(Role.USER),
//   reviewController.purchasePremiumReview
// );

export const reviewRouters = router;
