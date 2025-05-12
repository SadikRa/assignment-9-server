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
exports.reviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const cloudinary_1 = __importDefault(require("../../../shared/cloudinary"));
const client_1 = require("@prisma/client");
const ssl_service_1 = require("../SSL/ssl.service");
/// create review
const createReview = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const isAccountExist = yield prisma_1.default.account.findUnique({
        where: { id: payload.accountId },
    });
    console.log(isAccountExist);
    if (!isAccountExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    const isProductExist = yield prisma_1.default.product.findUnique({
        where: { id: payload.productId },
    });
    console.log(isProductExist);
    if (!isProductExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "product not found");
    }
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.companyImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    const result = yield prisma_1.default.review.create({
        data: Object.assign({}, payload),
    });
    return result;
});
/// get review
const getReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
        include: {
            product: true,
            account: {
                select: {
                    id: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    votes: true,
                    ReviewComment: true,
                },
            },
        },
    });
    return result;
});
/// get a review
const getAReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            product: true,
            account: {
                select: {
                    id: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    votes: true,
                    ReviewComment: true,
                },
            },
        },
    });
    return result;
});
/// update review
const updateAReview = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.review.findUniqueOrThrow({
        where: { id },
    });
    if (!data || Object.keys(data).length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No data provided to update");
    }
    const result = yield prisma_1.default.review.update({
        where: { id },
        data,
    });
    return result;
});
/// delete review
const deleteAReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.review.findUniqueOrThrow({ where: { id: id } });
    const result = yield prisma_1.default.review.update({
        where: { id: id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
// init Premium Payment
const initPremiumPayment = (reviewId, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: {
            id: reviewId,
        },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Premium review not found");
    }
    if (!review.premiumPrice || review.premiumPrice <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid premium price");
    }
    // Begin transaction
    const [updatedReview, payment] = yield prisma_1.default.$transaction([
        prisma_1.default.review.update({
            where: { id: reviewId },
            data: { isPremium: true },
        }),
        prisma_1.default.payment.create({
            data: {
                amount: review.premiumPrice,
                status: client_1.PaymentStatus.PENDING,
                accountId: review.accountId,
                reviewId: review.id,
                currency: "BDT",
            },
        }),
    ]);
    // Prepare SSLCommerz payload
    const paymentData = {
        amount: review.premiumPrice,
        transactionId: payment.id,
        name: payLoad === null || payLoad === void 0 ? void 0 : payLoad.name,
        email: review.account.email,
        address: payLoad.address,
        phoneNumber: payLoad.number,
    };
    // Initiate payment
    const result = yield ssl_service_1.SSLService.initPayment(paymentData);
    return {
        paymentUrl: result.GatewayPageURL,
        paymentId: payment.id,
    };
});
const validatePremiumPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate payment with SSLCommerz
    const validationResponse = yield ssl_service_1.SSLService.validatePayment(payload);
    // Update payment status
    yield prisma_1.default.payment.update({
        where: { id: payload.tran_id },
        data: {
            status: client_1.PaymentStatus.COMPLETED,
            paymentGatewayData: validationResponse,
        },
        include: {
            review: true,
        },
    });
    return {
        success: true,
        message: "Payment completed successfully",
    };
});
exports.reviewService = {
    createReview,
    getReviews,
    getAReview,
    updateAReview,
    deleteAReview,
    initPremiumPayment,
    validatePremiumPayment,
};
