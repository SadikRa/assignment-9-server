// src/app/modules/user/user.controller.ts
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.getMyProfile(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await userService.updateMyProfile(email, req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const deleteMyProfile = catchAsync(async (req, res) => {
  await userService.deleteMyProfile(req.user.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile deleted successfully",
    data: null,
  });
});

export const UserController = {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
};
