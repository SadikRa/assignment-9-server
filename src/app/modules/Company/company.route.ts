import { NextFunction, Request, Response, Router } from "express";
import { CompanyValidation } from "./company.validation";
import fileUploader from "../../../helpers/fileUploader";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { companyController } from "./company.controller";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

/// create Company
router.post(
  "/create-company",
  auth(Role.ADMIN),
  fileUploader.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = CompanyValidation.createCompany.parse(JSON.parse(req.body.data));
    companyController.createCompany(req, res, next);
  }
);

// get Company
router.get("/", companyController.getCompany);

// get a Company
router.get("/:id", companyController.getACompany);

// Update a Company
router.patch(
  "/update-company",
  auth(Role.COMPANY),
  validateRequest(CompanyValidation.updateCompany),
  companyController.updateACompany
);

// delete a Company
router.delete(
  "/delete-company",
  auth(Role.COMPANY),
  companyController.deleteACompany
);

export const companyRouters = router;
