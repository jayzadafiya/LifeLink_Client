import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import Head from "next/head";
import HashLoader from "react-spinners/HashLoader";

import { useState } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "../../utils/config";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import { signupFormvalidation } from "../../utils/formValidation";
import { SignupForm } from "../../interfaces/Forms";
import signupImg from "../../public/assets/images/signup.gif";

export default function Signup(): React.JSX.Element {
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<SignupForm>>({});

  const router = useRouter();

  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    photo: selectFile,
    gender: "",
    role: "patient",
    passwordConfirm: "",
  });

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

      setPreviewURL(url);
      setSelectFile(file);
      setFormData({ ...formData, photo: url });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;
    const formErrors = signupFormvalidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof SignupForm] || "",
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = signupFormvalidation(formData);
    setErrors(formErrors);
    if (!loading && Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        await axios.post(`${BASE_URL}/auth/signup`, formData);

        router.push("/login");

        toast.success("Registration Done !");
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);

        return null;
      }
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="Signup page" />
      </Head>
      <div className="w-full max-w-[1178px] mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* img boc */}

          <div className="hidden lg:flex items-center bg-primaryColor rounded-l-lg ">
            <figure>
              <Image src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>

          {/* signup form  */}
          <div className="container rounded-l-lg lg:pl-16 py-10 ">
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
                  onBlur={handleBlur}
                  className="w-full pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
                />
                {errors.name && (
                  <p className="text-red-500 text-sm ">{errors.name}</p>
                )}
              </div>

              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  value={formData.email}
                  onBlur={handleBlur}
                  onChange={handelInputChange}
                  className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onBlur={handleBlur}
                  onChange={handelInputChange}
                  className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
                />

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onBlur={handleBlur}
                  onChange={handelInputChange}
                  className="w-full  pr-4 py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
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

                <div className="flex flex-col">
                  <label className="text-headingColor  font-bold text-[16px] leading-7">
                    Gender:
                    <select
                      name="gender"
                      value={formData.gender}
                      onBlur={handleBlur}
                      onChange={handelInputChange}
                      className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
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
                  disabled={loading}
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
