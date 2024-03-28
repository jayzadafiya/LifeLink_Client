export const uploadImageToCloudinary = async (file) => {
  const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
  const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", upload_preset);
  uploadData.append("cloud_name", cloud_name);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "post",
      body: uploadData,
    }
  );

  const data = await res.json();

  console.log(res);

  return data;
};
