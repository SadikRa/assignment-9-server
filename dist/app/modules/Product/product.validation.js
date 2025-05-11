"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Define the enum values in Zod
const ProductCategoryEnum = zod_1.z.enum([
    client_1.ProductCategory.GADGETS,
    client_1.ProductCategory.CLOTHING,
    client_1.ProductCategory.BOOKS,
]);
const createProduct = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required" }),
    price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().nonnegative({ message: "Price must be 0 or more" })),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url({ message: "Invalid image URL" }).optional(),
    category: ProductCategoryEnum,
    companyId: zod_1.z
        .string()
        .uuid({ message: "Invalid company ID format" })
        .optional(),
});
const updateAProduct = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required" }).optional(),
    price: zod_1.z
        .preprocess((val) => Number(val), zod_1.z.number().nonnegative({ message: "Price must be 0 or more" }))
        .optional(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url({ message: "Invalid image URL" }).optional(),
    category: ProductCategoryEnum.optional(),
    isDeleted: zod_1.z.boolean().optional(),
    companyId: zod_1.z
        .string()
        .uuid({ message: "Invalid company ID format" })
        .optional(),
});
exports.productValidation = {
    createProduct,
    updateAProduct,
};
