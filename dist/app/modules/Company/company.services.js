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
exports.CompanyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const cloudinary_1 = __importDefault(require("../../../shared/cloudinary"));
const createCompany = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const isAccountExist = yield prisma_1.default.account.findUnique({
        where: { email },
    });
    if (!isAccountExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    const isCompanyExist = yield prisma_1.default.company.findUnique({
        where: { accountId: isAccountExist.id },
    });
    if (isCompanyExist) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Company already exists for this account");
    }
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.companyImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    const company = yield prisma_1.default.company.create({
        data: Object.assign(Object.assign({}, req.body), { accountId: isAccountExist.id }),
    });
    return company;
});
// /////   TO DO pagination and filter add Later
const getCompany = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.company.findMany();
    return result;
});
// get A Company
const getACompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.company.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
});
// update A Company
const updateACompany = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.company.findUniqueOrThrow({
        where: { id: id },
    });
    const result = yield prisma_1.default.company.update({
        where: { id: id },
        data: data,
    });
    return result;
});
//delete A Company
const deleteACompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.company.findUniqueOrThrow({ where: { id: id } });
    const result = yield prisma_1.default.company.update({
        where: { id: id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
exports.CompanyService = {
    createCompany,
    getCompany,
    getACompany,
    updateACompany,
    deleteACompany,
};
