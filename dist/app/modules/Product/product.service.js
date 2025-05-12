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
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
/// create product
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.user;
    yield prisma_1.default.account.findUniqueOrThrow({
        where: { email },
    });
    // const file = req.file as IFile;
    // if (req.file) {
    //   const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    //   req.body.imageUrl = uploadToCloudinary?.secure_url;
    // }
    const { name, price, description, category } = req.body;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const result = yield prisma_1.default.product.create({
        data: {
            name,
            price: parseFloat(price),
            description,
            category,
            imageUrl,
        },
    });
    return result;
});
/////   TO DO pagination and filter add Later
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findMany({
        orderBy: {
            createdAt: "desc", // latest products first
        },
        include: {
            reviews: {
                orderBy: {
                    createdAt: "desc", // latest reviews first
                },
                include: {
                    votes: true,
                    ReviewComment: true,
                    account: true,
                },
            },
        },
    });
    return result;
});
const getAProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            reviews: {
                orderBy: {
                    createdAt: "desc", // newest reviews first
                },
                include: {
                    votes: true,
                    ReviewComment: true,
                    account: true,
                },
            },
        },
    });
    return result;
});
const updateAProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: { id },
    });
    if (!data || Object.keys(data).length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No data provided to update");
    }
    const result = yield prisma_1.default.product.update({
        where: { id },
        data,
    });
    return result;
});
const deleteAProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({ where: { id: id } });
    const result = yield prisma_1.default.product.update({
        where: { id: id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
exports.ProductService = {
    createProduct,
    getProducts,
    getAProduct,
    updateAProduct,
    deleteAProduct,
};
