import { useState } from "react";

import Image from "next/image";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import { useRouter } from "next/router";
import { uploadImageToCloudinary } from "@/utils/uploadCloudinary";
import { BASE_URL, token } from "@/utils/config";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/store/slices/userSlice";
import Error from "../Error/Error";

export default function Profile({ user }) {
  const [selectFile, setSelectFile] = useState(user?.photo);
  const dispatch = useDispatch();
  const router = useRouter();
  const { error, loading } = useSelector((state) => state.user);

  const [formData, setFormDate] = useState({
    name: user?.name || "",
    email: user?.email || "",
    photo: user?.photo || "",
    gender: user?.gender || "",
    bloodType: user?.bloodType || "",
  });

  if (error) {
    return <Error errMessgae={error} />;
  }

  const handelInputChange = (e) => {
    setFormDate({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];

    const { url } = await uploadImageToCloudinary(file);

    setFormDate({ ...formData, photo: url });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUser({ formData, userId: user._id })).then((result) => {
        if (result.payload && result.payload.data) {
          router.push("/users/profile");
        }
      });
    } catch (error) {
      return <Error errMessgae={error} />;
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
            value={formData.name}
            onChange={handelInputChange}
            className="w-full pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
          />
        </div>

        <div className="mb-5">
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={formData.email}
            onChange={handelInputChange}
            className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
          />
        </div>
        <div className="mb-5">
          <input
            type="test"
            placeholder="Blood Type"
            name="bloodType"
            value={formData.bloodType}
            onChange={handelInputChange}
            className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <label className="text-headingColor  font-bold text-[16px] leading-7">
            Gender:
            <select
              name="gender"
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

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[68px] h-[68px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
              <Image
                src={formData.photo}
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
