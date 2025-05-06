import httpStatus from "http-status";
import { Request } from "express";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import uploadCloud from "../../../shared/cloudinary";
import { Review, ReviewStatus, Role } from "@prisma/client";

/// create review
const createReview = async (req: Request) => {
  const payload = req.body;

  const isAccountExist = await prisma.account.findUnique({
    where: { id: payload.accountId },
  });

  console.log(isAccountExist);

  if (!isAccountExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Account not found");
  }

  const isProductExist = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  console.log(isProductExist);

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, "product not found");
  }

  if (req.file) {
    const uploadedImage = await uploadCloud(req.file);
    req.body.companyImage = uploadedImage?.secure_url;
  }

  const result = await prisma.review.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      product: true,
      account: {
        select: {
          id: true,
          email: true,
        },
      },
      _count: {
        select: {
          votes: true,
          ReviewComment: true,
        },
      },
    },
  });
  return result;
};

const getAReview = async (id: string) => {
  const result = await prisma.review.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      product: true,
      account: {
        select: {
          id: true,
          email: true,
        },
      },
      _count: {
        select: {
          votes: true,
          ReviewComment: true,
        },
      },
    },
  });

  return result;
};

const updateAReview = async (id: string, data: Partial<Review>) => {
  await prisma.review.findUniqueOrThrow({
    where: { id },
  });

  if (!data || Object.keys(data).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No data provided to update");
  }

  const result = await prisma.review.update({
    where: { id },
    data,
  });

  return result;
};

const deleteAReview = async (id: string) => {
  await prisma.review.findUniqueOrThrow({ where: { id: id } });

  const result = await prisma.review.update({
    where: { id: id, isDeleted: false },
    data: { isDeleted: true },
  });
  return result;
};

export const reviewService = {
  createReview,
  getReviews,
  getAReview,
  updateAReview,
  deleteAReview,
};
