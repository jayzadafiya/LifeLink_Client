import Link from "next/link";
import React, { useState } from "react";

export default function Login() {
  const [formData, setFormDate] = useState({
    email: "",
    password: "",
  });

  const handelInputChange = (e) => {
    setFormDate({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span> Back
        </h3>

        <form action="" className="py-4 md:py-0">
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
          </div>
          <div className="mb-5">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handelInputChange}
              className="w-full py-3 border-b border-solid border-[#8066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16 px] leading-7 text-headingColor cursor-pointer "
            />
          </div>
          <div className="mt-7">
            <button
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] px-4 py-3  rounded-lg "
              type="submit"
            >
              Login
            </button>
          </div>
          <p className="mt-5 text-textColor text-center">
            Don&apos;t have an account?
            <Link href="/signup" className="text-primaryColor font-medium ml-1">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
