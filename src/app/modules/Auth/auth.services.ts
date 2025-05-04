import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../../helpers/jwtHalpers";
import config from "../../../config";
import emailSender from "../../../shared/emailSender";
import { Role } from "@prisma/client";

const registerUser = async (payload: any) => {
  if (!payload.email || !payload.password) {
    throw new AppError(
      "Email and password are required",
      httpStatus.BAD_REQUEST
    );
  }
  const isAccountExists = await prisma.account.findUnique({
    where: { email: payload.email },
  });

  if (isAccountExists) {
    throw new AppError("Account already exists", httpStatus.BAD_REQUEST);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(payload.email)) {
    throw new AppError("Invalid email format", httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const accountData = {
    email: payload.email,
    password: hashedPassword,
    role: Role.USER,
  };
  const result = await prisma.$transaction(async (tx) => {
    const createdAccount = await tx.account.create({ data: accountData });
    const userData = {
      name: payload.name,
      accountId: createdAccount.id,
    };
    await tx.user.create({ data: userData });
    return createdAccount;
  });
  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const isUserExists = await prisma.account.findUnique({
    where: { email: payload.email, isDeleted: false },
  });
  if (!isUserExists) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isUserExists.password
  );

  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }

  const { password, ...userData } = isUserExists;

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_secret as Secret,
    config.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.refresh_token_secret as Secret,
    config.refresh_token_expires_in as string
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const getMyProfile = async (email: string) => {
  const user = await prisma.account.findUnique({
    where: { email: email, isDeleted: false },
    include: {
      company: true,
      user: true,
      admin: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }
  return user;
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.account.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      isDeleted: false,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_secret as Secret,
    config.expires_in as string
  );

  return accessToken;
};

const changePassword = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const isExistAccount = await prisma.account.findUnique({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  if (!isExistAccount) {
    throw new AppError("Account not found !", httpStatus.NOT_FOUND);
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    isExistAccount.password
  );

  if (!isCorrectPassword) {
    throw new AppError("Old password is incorrect", httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);

  await prisma.account.update({
    where: {
      email: isExistAccount.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return "Password update is successful.";
};

const forgetPassword = async (email: string) => {
  const isAccountExists = await prisma.account.findUnique({
    where: {
      email: email,
      isDeleted: false,
    },
  });

  if (!isAccountExists) {
    throw new AppError("Account not found", 404);
  }

  const resetToken = jwtHelpers.generateToken(
    {
      email: isAccountExists.email,
      role: isAccountExists.role,
    },
    config.reset_pass_token as Secret,
    config.reset_pass_token_expires_in as string
  );

  const resetPassLink = `${config.reset_pass_link}?token=${resetToken}&email=${isAccountExists.email}`;

  await emailSender(
    email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );

  return "Reset password link sent to your email!";
};

const resetPassword = async (
  token: string,
  email: string,
  newPassword: string
) => {
  let decodedData: JwtPayload;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.reset_pass_token as Secret
    );
  } catch (err) {
    throw new AppError("Invalid or expired token", httpStatus.UNAUTHORIZED);
  }

  const isAccountExists = await prisma.account.findUnique({
    where: {
      email: decodedData.email,
      isDeleted: false,
    },
  });
  if (!isAccountExists) {
    throw new AppError("Account not found!!", httpStatus.NOT_FOUND);
  }
  if (isAccountExists.email !== email) {
    throw new AppError("Invalid email", httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(newPassword, 10);

  await prisma.account.update({
    where: {
      email: isAccountExists.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return "Password reset successfully!";
};

export const AuthService = {
  registerUser,
  loginUser,
  getMyProfile,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
