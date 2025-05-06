import express from "express";
import { authRouter } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { productRouters } from "../modules/Product/product.route";
import { companyRouters } from "../modules/Company/company.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
