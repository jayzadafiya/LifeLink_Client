import { logout } from "@/store/slices/userSlice";
import { useRouter } from "next/router";
import React from "react";
import { BiMenu } from "react-icons/bi";
import { useDispatch } from "react-redux";

export default function Tabs({ tab, setTab }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };
  return (
    <div>
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />
      </span>
      <div className="hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
        <button
          onClick={() => setTab("overview")}
          className={`${
            tab === "overview"
              ? "bg-indigo-100 text-primaryColor "
              : "bg-transparent text-headingColor"
          } w-full btn mt-8 rounded-md`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("appointments")}
          className={`${
            tab === "appointments"
              ? "bg-indigo-100 text-primaryColor "
              : "bg-transparent text-headingColor"
          } w-full btn mt-8 rounded-md`}
        >
          Appointments
        </button>
        <button
          onClick={() => setTab("settings")}
          className={`${
            tab === "settings"
              ? "bg-indigo-100 text-primaryColor "
              : "bg-transparent text-headingColor"
          } w-full btn mt-8 rounded-md`}
        >
          Profile
        </button>
        <div className="mt-[100px] w-full ">
          <button
            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md  text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
