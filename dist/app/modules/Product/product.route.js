"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouters = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = (0, express_1.Router)();
/// create product
router.post("/create-product", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN, client_1.Role.USER), fileUploader_1.fileUploader.upload.single("image"), (req, res, next) => {
    req.body = product_validation_1.productValidation.createProduct.parse(JSON.parse(req.body.data));
    product_controller_1.ProductController.createProduct(req, res, next);
});
// get product
router.get("/", product_controller_1.ProductController.getProducts);
// get a product
router.get("/:id", product_controller_1.ProductController.getAProduct);
// Update a Product
router.patch("/update-product/:id", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN), (0, validateRequest_1.default)(product_validation_1.productValidation.updateAProduct), product_controller_1.ProductController.updateAProduct);
// delete a Product
router.delete("/delete-product/:id", (0, auth_1.default)(client_1.Role.COMPANY, client_1.Role.ADMIN), product_controller_1.ProductController.deleteAProduct);
exports.productRouters = router;
