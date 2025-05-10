"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const cloudinary_1 = __importDefault(require("../../../shared/cloudinary"));
const client_1 = require("@prisma/client");
// get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isDeleted: true,
                    status: true,
                    isCompleteProfile: true,
                },
            },
        },
    });
    const count = yield prisma_1.default.user.count({
        where: {
            isDeleted: false,
        },
    });
    return {
        count,
        users,
    };
});
// find by id
const getMyProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isDeleted: true,
                    status: true,
                    isCompleteProfile: true,
                },
            },
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
// find by email
const getAccountByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.account.findUnique({
        where: {
            email,
            isDeleted: false,
        },
        include: {
            user: true,
            reviews: true,
            votes: true,
            ReviewComment: true,
            Payment: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
//make Admin
const makeAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.account.findUnique({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedAccount = yield prisma_1.default.account.update({
        where: {
            id: id,
        },
        data: {
            role: client_1.Role.ADMIN,
        },
    });
    return {
        userId: user.id,
        newRole: updatedAccount.role,
    };
});
// update user
const updateMyProfile = (email, req) => __awaiter(void 0, void 0, void 0, function* () {
    // find account and user account
    const isAccountExist = yield prisma_1.default.account.findUnique({
        where: {
            email,
            isDeleted: false,
        },
        include: {
            user: true,
        },
    });
    if (!isAccountExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // main update logic
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.profileImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    const updateuserInfo = yield prisma_1.default.$transaction((tClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const updateData = yield tClient.user.update({
            where: {
                id: (_a = isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            data: req.body,
            include: {
                account: true,
            },
        });
        yield tClient.account.update({
            where: {
                email,
            },
            data: {
                isCompleteProfile: true,
            },
        });
        return updateData;
    }));
    return updateuserInfo;
});
// delete user
const deleteMyProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExist = yield prisma_1.default.account.findUnique({
        where: {
            email,
            isDeleted: false,
        },
        include: {
            user: true,
        },
    });
    if (!isAccountExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    return yield prisma_1.default.$transaction((tClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const deleteUser = yield tClient.user.update({
            where: {
                id: (_a = isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            data: {
                isDeleted: true,
            },
        });
        yield tClient.account.update({
            where: {
                email,
            },
            data: {
                isDeleted: true,
            },
        });
        return { isDeleted: deleteUser.isDeleted };
    }));
});
exports.userService = {
    getAllUsers,
    getMyProfile,
    makeAdmin,
    updateMyProfile,
    deleteMyProfile,
    getAccountByEmail,
};
