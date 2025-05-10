"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteValidation = void 0;
const zod_1 = require("zod");
const createVote = zod_1.z.object({
    reviewId: zod_1.z.string().uuid({ message: "Invalid review ID format" }),
    accountId: zod_1.z.string().uuid({ message: "Invalid account ID format" }),
    upVote: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Upvote must be a non-negative integer" }),
    downVote: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Downvote must be a non-negative integer" }),
});
const updateVote = zod_1.z.object({
    upVote: zod_1.z.number().int().nonnegative().optional(),
    downVote: zod_1.z.number().int().nonnegative().optional(),
});
exports.voteValidation = {
    createVote,
    updateVote,
};
