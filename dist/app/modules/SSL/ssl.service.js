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
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: config_1.default.ssl.storeId,
            store_passwd: config_1.default.ssl.storePass,
            total_amount: paymentData.amount,
            currency: "BDT",
            tran_id: paymentData.transactionId,
            success_url: config_1.default.ssl.successUrl,
            fail_url: config_1.default.ssl.failUrl,
            cancel_url: config_1.default.ssl.cancelUrl,
            ipn_url: config_1.default.ssl.ipnUrl,
            shipping_method: "N/A",
            product_name: "Premium Review Access",
            product_category: "Digital Service",
            product_profile: "general",
            cus_name: paymentData.name,
            cus_email: paymentData.email,
            cus_add1: paymentData.address || "N/A",
            cus_add2: "N/A",
            cus_city: "N/A",
            cus_state: "N/A",
            cus_postcode: "N/A",
            cus_country: "N/A",
            cus_phone: paymentData.phoneNumber || "N/A",
            cus_fax: "N/A",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: "N/A",
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "post",
            url: config_1.default.ssl.sslPaymentApi,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment error occurred!");
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method: "GET",
            url: `${config_1.default.ssl.sslValidationApi}?val_id=${payload.val_id}&store_id=${config_1.default.ssl.storeId}&store_passwd=${config_1.default.ssl.storePass}&format=json`,
        });
        return response.data;
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment validation failed!");
    }
});
exports.SSLService = {
    initPayment,
    validatePayment,
};
