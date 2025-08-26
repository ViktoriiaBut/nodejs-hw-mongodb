
// import cloudinary from 'cloudinary';
// import fs from 'node:fs/promises';
// import { getEnvVar } from './getEnvVar.js';

// cloudinary.v2.config({
//   secure: true,
//   cloud_name: getEnvVar("CLOUD_NAME"),
//   api_key: getEnvVar("API_KEY"),
//   api_secret: getEnvVar("API_SECRET"),
// });

// export const saveFileToCloudinary = async (file) => {

//     const response = await cloudinary.v2.uploader.upload(file.path);

//     await fs.unlink(file.path);
//     return response.secure_url;
// };

import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import { getEnvVar } from "./getEnvVar.js";

cloudinary.config({
  cloud_name: getEnvVar("CLOUD_NAME"),
  api_key: getEnvVar("API_KEY"),
  api_secret: getEnvVar("API_SECRET"),
  secure: true,
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file.path, {
      folder: "contacts", 
    });

    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
