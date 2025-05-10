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
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ssl_service_1 = require("../SSL/ssl.service");
const client_1 = require("@prisma/client");
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    // Prepare SSLCommerz payload
    const data = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        name: paymentData.name,
        email: paymentData.email,
        address: paymentData.address,
        phoneNumber: paymentData.phoneNumber,
    };
    const result = yield ssl_service_1.SSLService.initPayment(data);
    return result;
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield ssl_service_1.SSLService.validatePayment(payload);
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.payment.update({
            where: {
                id: response.tran_id,
            },
            data: {
                status: client_1.PaymentStatus.COMPLETED,
                paymentGatewayData: response,
            },
        });
    }));
    return {
        message: "Payment validated successfully",
    };
});
exports.PaymentService = {
    initPayment,
    validatePayment,
};
