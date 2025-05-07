import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.get("/ipn", PaymentController.validatePayment);

router.post("/init-payment/:reviewId", PaymentController.initPayment);

export const PaymentRoutes = router;
