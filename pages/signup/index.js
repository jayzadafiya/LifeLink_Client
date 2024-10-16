import { useState } from "react";
import { toast } from "react-toastify";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import { BASE_URL } from "@/utils/config";
import { uploadImageToCloudinary } from "@/utils/uploadCloudinary";
import signupImg from "../../public/assets/images/signup.gif";
import { useRouter } from "next/router";

export default function Signup() {
  const [selectFile, setSelectFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [formData, setFormDate] = useState({
    name: "",
    email: "",
    password: "",
    photo: selectFile,
    gender: "",
    role: "patient",
    passwordConfirm: "",
  });

  const handelInputChange = (e) => {
    setFormDate({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];

    const { url } = await uploadImageToCloudinary(file);

    setPreviewURL(url);
    setSelectFile(url);
    setFormDate({ ...formData, photo: url });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/signup`, formData);

      router.push("/login");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error.response.data.message || error.message;
      throw new Error(err);
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="w-full max-w-[1178px] mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* img boc */}

          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure>
              <Image src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>

          {/* signup form  */}
          <div className="rounded-l-lg lg:pl-16 py-10 ">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>

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
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handelInputChange}
                  className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handelInputChange}
                  className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
                />
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label className="text-headingColor  font-bold text-[16px] leading-7">
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handelInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>

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
                {selectFile && (
                  <figure className="w-[68px] h-[68px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
                    <Image
                      src={previewURL}
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
                  {loading ? (
                    <HashLoader size={35} color="#ffffff" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>

              <p className="mt-5 text-textColor text-center">
                Already have an account?
                <Link
                  href="/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
