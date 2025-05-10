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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const emailSender = (email, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config_1.default.email,
                pass: config_1.default.app_pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const info = yield transporter.sendMail({
            from: '"assignment 9" <sadikrahman494@gmail.com>',
            to: email,
            subject: "Reset Password Link",
            html,
        });
        console.log("Email sent:", info.messageId);
    }
    catch (error) {
        console.error("Failed to send email", error);
        throw new Error("Failed to send reset password email");
    }
});
exports.default = emailSender;
