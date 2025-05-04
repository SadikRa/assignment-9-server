import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHalpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/AppError";
import status from "http-status";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "you are not authorize");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(status.UNAUTHORIZED, "you are not authorize");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
