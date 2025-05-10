"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.updateUser = void 0;
const zod_1 = require("zod");
// Update user validation
exports.updateUser = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
    profileImage: zod_1.z.string().url("Invalid URL format").optional(),
    bio: zod_1.z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});
// Export validation schema
exports.userValidation = {
    updateUser: exports.updateUser,
};
