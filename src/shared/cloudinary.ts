import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: "divyajujl",
  api_key: "976442128758284",
  api_secret: "L6PU-UZRZmOQoAY-V2jxBCmHGK0",
});

const uploadCloud = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export default uploadCloud;
