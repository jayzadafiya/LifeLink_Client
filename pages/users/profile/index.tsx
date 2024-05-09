import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import Profile from "../../../components/User/Profile";
import Error from "../../../components/Error/Error";
import AppointmentTablePagination from "../../../components/AppointmentTable/TablePagination";

import { useState } from "react";
import { useRouter } from "next/router";
import { logout } from "../../../store/slices/userSlice";

import { capitalize } from "../../../utils/heplerFunction";
import { BASE_URL } from "../../../utils/config";
import avatarImg from "../../../public/assets/images/patient-avatar.png";
import { User } from "../../../interfaces/User";
import { Appointment } from "../../../interfaces/Doctor";
import { GetServerSidePropsContext } from "next";
import { useAppDispatch } from "../../../store/store";

// Interface for components props type
interface MyAccountProps {
  user: User;
  appointments: { upcoming: Appointment[]; history: Appointment[] };
  error: any;
}

export default function MyAccount({
  user,
  appointments,
  error,
}: MyAccountProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [tab, setTab] = useState("bookings");

  if (!user || error) {
    return <Error errMessage={error} />;
  }

  // Function for Logout service
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  return (
    <section>
      <Head>
        <title>{`${capitalize(user?.name)}'s Profile`}</title>
        <meta
          name="description"
          content="User profile setting and appointment data"
        />
      </Head>
      <div className="max-w[1178px] px-5 mx-auto ">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="pb-[50px] px-[38px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                <Image
                  src={user?.photo || avatarImg}
                  alt=""
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </figure>
            </div>

            <div className="text-center mt-4 ">
              <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                {user?.name}
              </h3>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                {user?.email}
              </p>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                Blood Type:
                <span className="ml-2 text-headingColor text-[22px] leading-8">
                  {user?.bloodType}
                </span>
              </p>
            </div>

            <div className="mt-[50px] md:mt-[70px]">
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

          <div className="md:col-span-2 md:px-[30px]">
            <div>
              <button
                onClick={() => setTab("bookings")}
                className={`${
                  tab === "bookings" && "bg-primaryColor text-white font-normal"
                }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7  border-primaryColor`}
              >
                My Appointments
              </button>
              <button
                onClick={() => setTab("history")}
                className={`${
                  tab === "history" && "bg-primaryColor text-white font-normal"
                } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7 border-primaryColor `}
              >
                History
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`${
                  tab === "settings" && "bg-primaryColor text-white font-normal"
                } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7 border-primaryColor `}
              >
                Profile Settings
              </button>
            </div>
            <div className={`${tab !== "bookings" ? "hidden" : ""}`}>
              <AppointmentTablePagination
                type="user"
                appointments={appointments?.upcoming}
              />
            </div>
            <div className={`${tab !== "history" ? "hidden" : ""}`}>
              <AppointmentTablePagination
                type="user"
                appointments={appointments?.history}
              />
            </div>

            <div className={`${tab !== "settings" ? "hidden" : ""}`}>
              <Profile user={user} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Data fetching Function for get data of user and appointments
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: Partial<MyAccountProps> }> {
  try {
    // Fetch the cookie token
    const cookieToken = context.req.cookies.token;

    const user = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });

    const appointments = await axios.get(`${BASE_URL}/users/my-appointments`, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });
    return {
      props: {
        user: user.data,
        appointments: appointments.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Error fetching user data",
      },
    };
  }
}
