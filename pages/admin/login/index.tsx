import Head from "next/head";
import toast from "react-hot-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { loginFormvalidation } from "../../../utils/formValidation";
import { RootState, useAppDispatch } from "../../../store/store";
import { LoginForm } from "../../../interfaces/Forms";
import { PayloadAction } from "@reduxjs/toolkit";
import { Admin, User } from "../../../interfaces/User";
import { Doctor } from "../../../interfaces/Doctor";
import { HashLoader } from "react-spinners";
import { adminLogin } from "../../../store/slices/adminSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.admin);

  const [formData, setFormDate] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const handelInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormDate({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string; value: string } = e.target;
    const formErrors = loginFormvalidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof LoginForm] || "", // Clear previous errors for this field
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formErrors = loginFormvalidation(formData);
    setErrors(formErrors);

    if (!loading && Object.keys(formErrors).length === 0) {
      try {
        dispatch(adminLogin(formData)).then(
          (result: PayloadAction<{ data: Admin }>) => {
            if (result.payload && result.payload.data) {
              router.push("/admin");
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
    <section className="px-5 lg:px-0">
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Login page" />
      </Head>
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span> Back
        </h3>

        <form action="" className="py-4 md:py-0" onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onBlur={handleBlur}
              onChange={handelInputChange}
              className="w-full py-3 border-b border-solid border-[#8066ff61] focus:outline-none
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
              className="w-full py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mt-7">
            <button
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] px-4 py-3  rounded-lg "
              type="submit"
            >
              {loading ? <HashLoader size={25} color="#ffffff" /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default Login;
