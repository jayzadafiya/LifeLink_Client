import { logout } from "../../../store/slices/userSlice";
import { useRouter } from "next/router";
import React from "react";
import { BiMenu } from "react-icons/bi";
import { useAppDispatch } from "../../../store/store";

// Interface for components props type
interface TabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

export default function Tabs({ tab, setTab }: TabsProps) {
  const dispatch = useAppDispatch();
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
        <button
          onClick={() => setTab("history")}
          className={`${
            tab === "history"
              ? "bg-indigo-100 text-primaryColor "
              : "bg-transparent text-headingColor"
          } w-full btn mt-8 rounded-md`}
        >
          History
        </button>
        <button
          onClick={() => setTab("updatePassword")}
          className={`${
            tab === "updatePassword"
              ? "bg-indigo-100 text-primaryColor "
              : "bg-transparent text-headingColor"
          } w-full btn mt-8 rounded-md`}
        >
          Change Password
        </button>
        <div className="mt-[50px] w-full ">
          <button
            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md border-[3px] border-solid border-transparent hover:border-[#181A1E] hover:text-[#181A1E] hover:bg-slate-300 font-bold  text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button className="w-full  rounded-md border-[3px] border-solid border-transparent bg-red-500  hover:border-red-500   hover:text-red-500 hover:bg-red-100 mt-4 p-3 text-[16px] leading-7 font-bold text-white">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
