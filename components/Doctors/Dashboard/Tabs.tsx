import axios from "axios";
import toast from "react-hot-toast";
import Model from "../../Timeslots/Model";
import { logout } from "../../../store/slices/userSlice";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { RootState, useAppDispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { BiMenu } from "react-icons/bi";
import { BASE_URL } from "../../../utils/config";
import { User } from "../../../interfaces/User";

// Interface for components props type
interface TabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

// Interface for Appointment data get from server
interface AppointmentData {
  date: string;
  time: string;
  user: User;
}

export default function Tabs({ tab, setTab }: TabsProps) {
  const dispatch = useAppDispatch();

  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { user, accessToken } = useSelector((state: RootState) => state.user);

  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (appointmentData.length === 0) {
        const message =
          "Warning: Account Deletion Consequences\n\nYour current email ID will no longer be usable on this site.\n\nAre you sure you want to delete your account?";
        const confirmation = window.confirm(message);

        if (confirmation && user) {
          const { data } = await axios.patch(
            `${BASE_URL}/doctors/${user._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!data.hasBookings && !data.bookingData) {
            dispatch(logout());
            router.replace("/");
            return null;
          }
          setDialogOpen(data.hasBookings);
          setAppointmentData(data.bookingData);
        }
      } else {
        setDialogOpen(true);
      }
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);

      return null;
    }
  };

  const handleConfirm = async () => {
    setDialogOpen(false);
    try {
      if (user) {
        await axios.patch(
          `${BASE_URL}/doctors/${user._id}/confirm`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        dispatch(logout());
        router.replace("/");
        return null;
      }
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);

      return null;
    }
  };
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => menuRef.current?.classList?.toggle("show__tab");

  return (
    <>
      <div>
        <span className="lg:hidden" onClick={toggleMenu}>
          <BiMenu className="w-6 h-6 cursor-pointer" />
        </span>
        <div className="profile_bar" ref={menuRef} onClick={toggleMenu}>
          <div className=" profile_tab  lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
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
                className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md border-[3px] border-solid border-transparent hover:border-[#181A1E] hover:text-[#181A1E] hover:bg-slate-300 font-bold  text-white cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="w-full  rounded-md border-[3px] border-solid border-transparent bg-red-500  hover:border-red-500   hover:text-red-500 hover:bg-red-100 mt-4 p-3 text-[16px] leading-7 font-bold text-white cursor-pointer"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <Model open={dialogOpen}>
          <div className="container bg-gray-100 text-textColor mt-[-35px] mb-[-35px] rounded-md p-8 m-w-[300px]">
            <div className="flex flex-col gap-3">
              <p className="font-bold">
                * Below is list of Appointment which isn't complated at
              </p>
              <div className="flex items-center justify-center ">
                <table className="border border-solid border-[#000] p-3 w-full">
                  <thead className="text-primaryColor">
                    <tr className="border border-solid border-[#000] p-3">
                      <th className="border border-solid border-[#000] p-3">
                        Name
                      </th>
                      <th className="border border-solid border-[#000] p-3">
                        Date
                      </th>
                      <th className="border border-solid border-[#000] p-3">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentData.map((appointmentData, index) => (
                      <tr className=" text-center" key={index}>
                        <td className="border border-solid border-[#000] p-3">
                          {appointmentData.user.name}
                        </td>
                        <td className="border border-solid border-[#000] p-3">
                          {appointmentData.date}
                        </td>
                        <td className="border border-solid border-[#000] p-3">
                          {appointmentData.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="font-semibold">
                * Are you still want to{" "}
                <span className="text-red-600 font-bold"> Delete</span> your
                account and if yes then users get there
                <span className="text-primaryColor font-bold"> Refund</span>
              </p>
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
      </div>
    </>
  );
}
