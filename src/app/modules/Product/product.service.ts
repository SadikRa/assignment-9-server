import httpStatus from "http-status";
import { Request } from "express";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import uploadCloud from "../../../shared/cloudinary";
import { Product } from "@prisma/client";

/// create product
const createProduct = async (req: Request) => {
  const { email } = req.user;
  console.log(email);

  const account = await prisma.account.findUnique({
    where: { email },
    include: { company: true },
  });

  if (!account || !account.company) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Company account not authorized or not found!"
    );
  }

  if (req.file) {
    const uploadedImage = await uploadCloud(req.file);
    req.body.imageUrl = uploadedImage?.secure_url;
  }

  req.body.companyId = account.company.id;

  const { name, price, description, category } = req.body;

  const result = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      description,
      category,
    },
  });

  return result;
};

const getProducts = async () => {};

const getAProduct = async (id: string) => {};

const updateAProduct = async (id: string, data: Product) => {};

const deleteAProduct = async (id: string) => {};

export const ProductService = {
  createProduct,
  getProducts,
  getAProduct,
  updateAProduct,
  deleteAProduct,
};
