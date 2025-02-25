import { v2 } from "cloudinary";
import fs from "fs/promises";

import path from "path";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResponse = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      `File uploaded on cloudinary cloud and got response ${uploadResponse}`
    );
    console.log(`cloud url of file ${uploadResponse.url}`);

    // Unlink local file after successful upload
    await fs.unlink(localFilePath);
    console.log(`Local file deleted: ${path.basename(localFilePath)}`);

    return uploadResponse;
  } catch (err) {
    // in case a erro occurs we dont want to pollute and fill up our server so we will unlink (delete) file from our server
    try {
      await fs.unlink(localFilePath);
      console.log(
        `Local file deleted after error: ${path.basename(localFilePath)}`
      );
    } catch (unlinkErr) {
      console.error("⚠️ Failed to delete local file after error:", unlinkErr);
    }
    return null;
  }
};

export default uploadOnCloudinary;
