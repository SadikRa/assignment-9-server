"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidation = void 0;
const zod_1 = require("zod");
const createCompany = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Company name is required" }).optional(),
    accountId: zod_1.z.string().uuid({ message: "Invalid account ID format" }),
    website: zod_1.z.string().url({ message: "Invalid website URL" }).optional(),
    companyImage: zod_1.z.string().url({ message: "Invalid image URL" }).optional(),
    description: zod_1.z.string().optional(),
});
const updateCompany = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Company name is required" }).optional(),
    website: zod_1.z.string().url({ message: "Invalid website URL" }).optional(),
    companyImage: zod_1.z.string().url({ message: "Invalid image URL" }).optional(),
    description: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.CompanyValidation = {
    createCompany,
    updateCompany,
};
