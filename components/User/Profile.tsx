import Image from "next/image";
import HashLoader from "react-spinners/HashLoader";
import Error from "../Error/Error";
import avtarImg from "../../public/assets/images/patient-avatar.png";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/router";
import { updateUser } from "../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import { patientFormValidation } from "../../utils/formValidation";
import { RootState, useAppDispatch } from "../../store/store";
import { User } from "../../interfaces/User";
import { UserForm } from "../../interfaces/Forms";
import { PayloadAction } from "@reduxjs/toolkit";

export default function Profile({ user }: { user: User }): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, loading } = useSelector((state: RootState) => state.user);
  const [errors, setErrors] = useState<Partial<UserForm>>({});

  const [formData, setFormData] = useState<UserForm>({
    name: user?.name || "",
    email: user?.email || "",
    photo: user?.photo || "",
    gender: user?.gender || "",
    bloodType: user?.bloodType || "",
  });

  if (error) {
    return <Error errMessage={error} />;
  }

  const handelInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const { url } = await uploadImageToCloudinary(file);

      setFormData({ ...formData, photo: url });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const formErrors = patientFormValidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof UserForm] || "", // Clear previous errors for this field
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formError = patientFormValidation(formData);
    setErrors(formError);

    if (Object.keys(formError).length === 0) {
      try {
        dispatch(updateUser(formData)).then(
          (result: PayloadAction<{ data: User }>) => {
            if (result.payload && result.payload.data) {
              router.push("/users/profile");
            }
          }
        );
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);

        return null;
      }
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={submitHandler}>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            onBlur={handleBlur}
            value={formData.name}
            onChange={handelInputChange}
            className="w-full pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-5">
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            onBlur={handleBlur}
            value={formData.email}
            className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
            aria-readonly
            readOnly
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Blood Type"
            name="bloodType"
            onBlur={handleBlur}
            value={formData.bloodType}
            onChange={handelInputChange}
            className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
          />
          {errors.bloodType && (
            <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
          )}
        </div>

        <div className="mb-5">
          <div className=" flex items-center justify-between">
            <label className="text-headingColor  font-bold text-[16px] leading-7">
              Gender:
              <select
                name="gender"
                onBlur={handleBlur}
                value={formData.gender}
                onChange={handelInputChange}
                className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[68px] h-[68px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
              <Image
                src={formData.photo || avtarImg}
                alt=""
                className="rounded-full w-[68px] h-[68px]"
                height={68}
                width={68}
              />
            </figure>
          )}

          <div className="relative w-[138px] h-[58px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg , .png"
              className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute  top-0 left-0 w-full h-full flex items-center px-[1.5rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            disabled={loading && true}
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] px-4 py-3  rounded-lg "
            type="submit"
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
