"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCommentValidation = void 0;
const zod_1 = require("zod");
const createReviewComment = zod_1.z.object({
    reviewId: zod_1.z.string().uuid({ message: "Invalid review ID format" }),
    accountId: zod_1.z.string().uuid({ message: "Invalid account ID format" }),
    content: zod_1.z.string().min(1, { message: "Comment content is required" }),
});
const updateReviewComment = zod_1.z.object({
    content: zod_1.z.string().min(1, { message: "Comment content is required" }).optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.ReviewCommentValidation = {
    createReviewComment,
    updateReviewComment,
};
