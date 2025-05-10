"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const product_route_1 = require("../modules/Product/product.route");
const company_route_1 = require("../modules/Company/company.route");
const review_route_1 = require("../modules/Review/review.route");
const vote_route_1 = require("../modules/Vote/vote.route");
const reviewComment_route_1 = require("../modules/ReviewComment.ts/reviewComment.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/product",
        route: product_route_1.productRouters,
    },
    {
        path: "/company",
        route: company_route_1.companyRouters,
    },
    {
        path: "/review",
        route: review_route_1.reviewRouters,
    },
    {
        path: "/vote",
        route: vote_route_1.voteRouters,
    },
    {
        path: "/comment",
        route: reviewComment_route_1.reviewCommentRouters,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
