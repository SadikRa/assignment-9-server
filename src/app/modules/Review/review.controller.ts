import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request } from "express";
import { reviewService } from "./review.service";

// create a Review
const createReview = catchAsync(async (req, res) => {
    // TO DO 
    console.log("object", req.body);
    console.log(req.params);
  const result = await reviewService.createReview(req as Request);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

// get Review
const getReview = catchAsync(async (req, res) => {
  const result = await reviewService.getReviews();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review get successfully",
    data: result,
  });
});

/// get a Review
const getAReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewService.getAReview(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review a get successfully",
    data: result,
  });
});

/// update A Review
const updateAReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewService.updateAReview(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

/// update A Review
const deleteAReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewService.deleteAReview(id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReview,
  getAReview,
  updateAReview,
  deleteAReview,
};
