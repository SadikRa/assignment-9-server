"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRouters = void 0;
const express_1 = require("express");
const company_validation_1 = require("./company.validation");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const company_controller_1 = require("./company.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = (0, express_1.Router)();
/// create Company
router.post("/create-company", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.USER), fileUploader_1.fileUploader.upload.single("image"), (req, res, next) => {
    req.body = company_validation_1.CompanyValidation.createCompany.parse(JSON.parse(req.body.data));
    company_controller_1.companyController.createCompany(req, res, next);
});
// get Company
router.get("/", company_controller_1.companyController.getCompany);
// get a Company
router.get("/:id", company_controller_1.companyController.getACompany);
// Update a Company
router.patch("/update-company/:id", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN), (0, validateRequest_1.default)(company_validation_1.CompanyValidation.updateCompany), company_controller_1.companyController.updateACompany);
// delete a Company
router.delete("/delete-company/:id", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN), company_controller_1.companyController.deleteACompany);
exports.companyRouters = router;
