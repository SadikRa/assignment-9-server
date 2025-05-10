"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRouters = void 0;
const express_1 = require("express");
const vote_validation_1 = require("./vote.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const vote_controller_1 = require("./vote.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.post("/create-vote", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), (0, validateRequest_1.default)(vote_validation_1.voteValidation.createVote), vote_controller_1.voteController.createVote);
router.get("/", vote_controller_1.voteController.getVotes);
router.get("/:id", vote_controller_1.voteController.getAVote);
router.patch("/update-vote/:id", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), (0, validateRequest_1.default)(vote_validation_1.voteValidation.updateVote), vote_controller_1.voteController.updateVote);
router.delete("/delete-vote/:id", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), vote_controller_1.voteController.deleteVote);
exports.voteRouters = router;
