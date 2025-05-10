"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Enum for review status
const ReviewStatusEnum = zod_1.z.enum([
    client_1.ReviewStatus.APPROVED,
    client_1.ReviewStatus.PENDING,
    client_1.ReviewStatus.REJECTED,
]);
const baseReviewFields = {
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    rating: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => Number(val))
        .refine((val) => val >= 1 && val <= 5, {
        message: "Rating must be between 1 and 5",
    }),
    productId: zod_1.z
        .union([zod_1.z.string().uuid(), zod_1.z.literal(null)])
        .optional()
        .nullable(),
    purchaseSource: zod_1.z.string().optional().nullable(),
    images: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string().url()),
        zod_1.z.string().transform((val) => {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [val];
            }
        }),
    ])
        .optional()
        .default([]),
    isPremium: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform((val) => val === true || val === "true")
        .optional()
        .default(false),
    premiumPrice: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .optional()
        .default(5.0),
    previewContent: zod_1.z.string().optional().nullable(),
    fullContent: zod_1.z.string().optional().nullable(),
    accountId: zod_1.z.string().uuid(),
    status: ReviewStatusEnum.optional().default(client_1.ReviewStatus.PENDING),
    moderationNote: zod_1.z.string().optional().nullable(),
    isDeleted: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform((val) => val === true || val === "true")
        .optional()
        .default(false),
};
const createReviewSchema = zod_1.z.object(Object.assign({}, baseReviewFields));
const updateReviewSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).optional(),
    rating: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => Number(val))
        .refine((val) => val >= 1 && val <= 5)
        .optional(),
    productId: zod_1.z.string().uuid().nullable().optional(),
    purchaseSource: zod_1.z.string().optional().nullable(),
    images: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string().url()),
        zod_1.z.string().transform((val) => {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [val];
            }
        }),
    ])
        .optional(),
    isPremium: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform((val) => val === true || val === "true")
        .optional(),
    premiumPrice: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .optional(),
    previewContent: zod_1.z.string().optional().nullable(),
    fullContent: zod_1.z.string().optional().nullable(),
    status: ReviewStatusEnum.optional(),
    moderationNote: zod_1.z.string().optional().nullable(),
    isDeleted: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform((val) => val === true || val === "true")
        .optional(),
});
exports.reviewValidation = {
    createReviewSchema,
    updateReviewSchema,
};
