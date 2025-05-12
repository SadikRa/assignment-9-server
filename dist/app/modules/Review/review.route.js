"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouters = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = (0, express_1.Router)();
/// create review
router.post("/create-review", (0, auth_1.default)(client_1.Role.USER, client_1.Role.COMPANY, client_1.Role.ADMIN), fileUploader_1.fileUploader.upload.single("image"), (0, validateRequest_1.default)(review_validation_1.reviewValidation.createReviewSchema), review_controller_1.reviewController.createReview);
// get all review
router.get("/", review_controller_1.reviewController.getReview);
// get single review
router.get("/:id", (0, auth_1.default)(client_1.Role.USER, client_1.Role.COMPANY, client_1.Role.ADMIN), review_controller_1.reviewController.getAReview);
/// update review
router.patch("/update-review/:id", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN), (0, validateRequest_1.default)(review_validation_1.reviewValidation.updateReviewSchema), review_controller_1.reviewController.updateAReview);
router.delete("/delete-review/:id", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN), review_controller_1.reviewController.deleteAReview);
// init-payment
router.post("/:id/init-payment", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN, client_1.Role.COMPANY), review_controller_1.reviewController.initPremiumPayment);
// validate payment
router.post("/validate-payment", review_controller_1.reviewController.validatePremiumPayment);
exports.reviewRouters = router;
