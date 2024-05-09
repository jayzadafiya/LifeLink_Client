import axios from "axios";
import toast from "react-hot-toast";

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
