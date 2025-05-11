"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewCommentRouters = void 0;
const express_1 = require("express");
const reviewComment_validation_1 = require("./reviewComment.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const reviewComment_controller_1 = require("./reviewComment.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.post("/create-review-comment", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), (0, validateRequest_1.default)(reviewComment_validation_1.ReviewCommentValidation.createReviewComment), reviewComment_controller_1.reviewCommentController.createReviewComment);
router.get("/", reviewComment_controller_1.reviewCommentController.getReviewComments);
router.get("/:id", reviewComment_controller_1.reviewCommentController.getAReviewComment);
router.patch("/update-review-comment/:id", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), (0, validateRequest_1.default)(reviewComment_validation_1.ReviewCommentValidation.updateReviewComment), reviewComment_controller_1.reviewCommentController.updateReviewComment);
router.delete("/delete-review-comment/:id", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), reviewComment_controller_1.reviewCommentController.deleteReviewComment);
exports.reviewCommentRouters = router;
