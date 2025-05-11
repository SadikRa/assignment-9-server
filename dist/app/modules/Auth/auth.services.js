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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const jwtHalpers_1 = require("../../../helpers/jwtHalpers");
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("../../../shared/emailSender"));
const client_1 = require("@prisma/client");
// register user 
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.email || !payload.password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email and password are required");
    }
    const isAccountExists = yield prisma_1.default.account.findUnique({
        where: { email: payload.email },
    });
    if (isAccountExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Account already exists");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid email format");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const accountData = {
        email: payload.email,
        password: hashedPassword,
        role: client_1.Role.USER,
    };
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdAccount = yield tx.account.create({ data: accountData });
        const userData = {
            name: payload.name,
            accountId: createdAccount.id,
        };
        yield tx.user.create({ data: userData });
        return createdAccount;
    }));
    return result;
});
// Login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.default.account.findUnique({
        where: { email: payload.email, isDeleted: false },
    });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, isUserExists.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid password");
    }
    const { password } = isUserExists, userData = __rest(isUserExists, ["password"]);
    const accessToken = jwtHalpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_secret, config_1.default.expires_in);
    const refreshToken = jwtHalpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
});
// get my profile
const getMyProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.account.findUnique({
        where: { email: email, isDeleted: false },
        include: {
            company: true,
            user: true,
            admin: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
// refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHalpers_1.jwtHelpers.verifyToken(token, config_1.default.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.default.account.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            isDeleted: false,
        },
    });
    const accessToken = jwtHalpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_secret, config_1.default.expires_in);
    return accessToken;
});
// change password
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAccount = yield prisma_1.default.account.findUnique({
        where: {
            email: user.email,
            isDeleted: false,
        },
    });
    if (!isExistAccount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found !");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, isExistAccount.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield prisma_1.default.account.update({
        where: {
            email: isExistAccount.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return "Password update is successful.";
});
/// forget password
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExists = yield prisma_1.default.account.findUnique({
        where: {
            email: email,
            isDeleted: false,
        },
    });
    if (!isAccountExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    const resetToken = jwtHalpers_1.jwtHelpers.generateToken({
        email: isAccountExists.email,
        role: isAccountExists.role,
    }, config_1.default.reset_pass_token, config_1.default.reset_pass_token_expires_in);
    const resetPassLink = `${config_1.default.reset_pass_link}?token=${resetToken}&email=${isAccountExists.email}`;
    yield (0, emailSender_1.default)(email, `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `);
    return "Reset password link sent to your email!";
});
const resetPassword = (token, email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHalpers_1.jwtHelpers.verifyToken(token, config_1.default.reset_pass_token);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
    }
    const isAccountExists = yield prisma_1.default.account.findUnique({
        where: {
            email: decodedData.email,
            isDeleted: false,
        },
    });
    if (!isAccountExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found!!");
    }
    if (isAccountExists.email !== email) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid email");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield prisma_1.default.account.update({
        where: {
            email: isAccountExists.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return "Password reset successfully!";
});
exports.AuthService = {
    registerUser,
    loginUser,
    getMyProfile,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
