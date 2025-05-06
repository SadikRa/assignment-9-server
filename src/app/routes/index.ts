import express from "express";
import { authRouter } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { productRouters } from "../modules/Product/product.route";
import { companyRouters } from "../modules/Company/company.route";
import { reviewRouters } from "../modules/Review/review.route";
import { voteRouters } from "../modules/Vote/vote.route";
import { reviewCommentRouters } from "../modules/ReviewComment.ts/reviewComment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/product",
    route: productRouters,
  },
  {
    path: "/company",
    route: companyRouters,
  },
  {
    path: "/review",
    route: reviewRouters,
  },
  {
    path: "/vote",
    route: voteRouters,
  },
  {
    path: "/comment",
    route: reviewCommentRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
