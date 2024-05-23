import axios from "axios";
import toast from "react-hot-toast";
import * as crypto from "crypto";
import { BASE_URL } from "./config";

export const uploadImageToCloudinary = async (file: File) => {
  const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
  const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;
  try {
    const uploadData = new FormData();
    uploadData.append("file", file);

    if (upload_preset && cloud_name) {
      uploadData.append("upload_preset", upload_preset);
      uploadData.append("cloud_name", cloud_name);
    }

    const loadingToastId = toast.loading("Uploading photo...", {
      duration: 0,
    });

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      uploadData
    );

    toast.dismiss(loadingToastId);

    toast.success("Photo uploaded successfully");
    return data;
  } catch {
    toast.error("Error uploading photo");
    return null;
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  const publicId = extractPublicId(imageUrl);

  try {
    await axios.post(`${BASE_URL}/cloudinary`, { publicId: publicId });

    toast.success("Photo deleted successfully");
  } catch (error) {
    toast.error("Error deleting photo");
    console.error(error);
    return null;
  }
};

const extractPublicId = (imageUrl: string): string => {
  const parts = imageUrl.split("/");
  const filename = parts.pop();
  let publicId = "";
  if (filename) {
    publicId = filename.split(".")[0];
  }
  return publicId;
};
