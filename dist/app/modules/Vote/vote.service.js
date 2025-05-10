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
exports.VoteService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createVote = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, accountId, upVote, downVote } = data;
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
    const vote = yield prisma_1.default.vote.create({
        data: { reviewId, accountId, upVote, downVote },
    });
    return vote;
});
const getVotes = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vote.findMany();
    return result;
});
const getAVote = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vote.findUniqueOrThrow({
        where: { id },
    });
    return result;
});
const updateVote = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vote.findUniqueOrThrow({
        where: { id },
    });
    const result = yield prisma_1.default.vote.update({
        where: { id },
        data,
    });
    return result;
});
const deleteVote = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vote.findUniqueOrThrow({
        where: { id },
    });
    const result = yield prisma_1.default.vote.delete({
        where: { id },
    });
    return result;
});
exports.VoteService = {
    createVote,
    getVotes,
    getAVote,
    updateVote,
    deleteVote,
};
