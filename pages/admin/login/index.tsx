import Head from "next/head";
import toast from "react-hot-toast";
import Model from "../../../components/Timeslots/Model";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { loginFormvalidation } from "../../../utils/formValidation";
import { RootState, useAppDispatch } from "../../../store/store";
import { LoginForm } from "../../../interfaces/Forms";
import { PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../../interfaces/User";
import { HashLoader } from "react-spinners";
import {
  adminLogin,
  setIsAlreadyLogging,
} from "../../../store/slices/adminSlice";
import { GetServerSidePropsContext } from "next";

interface LoginProps {
  browser: string;
  os: string;
  device: string;
}

export default function Login({
  userAgent,
}: {
  userAgent: LoginProps;
}): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isAlreadyLogging, loading, browser, device, os } = useSelector(
    (state: RootState) => state.admin
  );

  const [formData, setFormDate] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [secretKey, setSecretKey] = useState<string>("");

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
        dispatch(adminLogin({ ...formData, ...userAgent })).then(
          (
            result: PayloadAction<{ data: Admin; isAlreadyLogging: boolean }>
          ) => {
            console.log(result.payload);
            if (
              result.payload &&
              result.payload.data &&
              !result.payload.isAlreadyLogging
            ) {
              router.replace("/admin");
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

  const handleConfirm = () => {
    if (secretKey.trim() === "") {
      toast.error("Please Add secret key");
      return null;
    }

    dispatch(adminLogin({ ...formData, ...userAgent, secretKey })).then(
      (result: PayloadAction<{ data: Admin; isAlreadyLogging: boolean }>) => {
        console.log(result.payload);
        if (
          result.payload &&
          result.payload.data &&
          !result.payload.isAlreadyLogging
        ) {
          router.replace("/admin");
        }
      }
    );
  };

  const handleCloseDialog = () => {
    dispatch(setIsAlreadyLogging());
  };

  return (
    <>
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
                disabled={loading}
                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] px-4 py-3  rounded-lg "
                type="submit"
              >
                {loading ? <HashLoader size={25} color="#ffffff" /> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Model open={isAlreadyLogging}>
        <div className="container bg-gray-100 text-textColor mt-[-35px] mb-[-35px] rounded-md p-8 m-w-[200px]">
          <div className="flex flex-col gap-5">
            <p className="font-bold">
              *Your account is{" "}
              <span className="text-blue-700 text-[18px] font-extrabold">
                logged{" "}
              </span>
              in on another device. If you want to change devices, please{" "}
              <span className="text-red-600 text-[18px] font-extrabold">
                log out{" "}
              </span>
              from that device or add a{" "}
              <span className="text-green-600 text-[18px] font-extrabold">
                secret key{" "}
              </span>
              and confirm Identity.
            </p>

            <div>
              <p className="font-bold text-[18px] mb-3">
                Your device information:
              </p>
              <p>
                <strong>Browser:</strong> {browser}
              </p>
              {os && (
                <p>
                  <strong>Operating System:</strong> {os}
                </p>
              )}
              {device && (
                <p>
                  <strong>Device:</strong> {device}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="secret"
                placeholder="Add secret key"
                className="form__input"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-5  flex-col md:flex-row">
            <button
              className="btn px-2  w-full rounded-md   btn-hover "
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              className="w-full  rounded-md border-[3px] border-solid border-transparent bg-red-500  hover:border-red-500   hover:text-red-500 hover:bg-red-100 md:mt-[38px] py-3 px-2 text-[16px] leading-7 font-bold text-white cursor-pointer "
              onClick={handleCloseDialog}
            >
              Cancel
            </button>
          </div>
        </div>
      </Model>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  const browser = context.req.headers["x-forwarded-user-browser"] || "";
  const device = req.headers["x-forwarded-user-device"] || "";
  const os = context.req.headers["x-forwarded-user-os"] || "";

  return {
    props: {
      userAgent: { browser, device, os },
    },
  };
}
