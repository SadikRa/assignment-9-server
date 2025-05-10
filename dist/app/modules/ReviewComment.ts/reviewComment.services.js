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
exports.ReviewCommentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createReviewComment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, accountId } = req.body;
    const isReviewExist = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!isReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    const isAccountExist = yield prisma_1.default.account.findUnique({
        where: { id: accountId },
    });
    if (!isAccountExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    const reviewComment = yield prisma_1.default.reviewComment.create({
        data: req.body,
    });
    return reviewComment;
});
const getReviewComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.reviewComment.findMany({
        where: { isDeleted: false },
    });
    return result;
});
const getAReviewComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.reviewComment.findUniqueOrThrow({
        where: { id },
    });
    return result;
});
const updateReviewComment = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.reviewComment.findUniqueOrThrow({
        where: { id },
    });
    const result = yield prisma_1.default.reviewComment.update({
        where: { id },
        data,
    });
    return result;
});
const deleteReviewComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.reviewComment.findUniqueOrThrow({ where: { id } });
    const result = yield prisma_1.default.reviewComment.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
exports.ReviewCommentService = {
    createReviewComment,
    getReviewComments,
    getAReviewComment,
    updateReviewComment,
    deleteReviewComment,
};
