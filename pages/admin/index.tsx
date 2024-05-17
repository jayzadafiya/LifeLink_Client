import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import DoctorCard from "../../components/Doctors/DoctorCard";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

export default function Admin({ admin }): React.JSX.Element {
  const [tab, setTab] = useState("requests");
  return (
    <section>
      <div className="container">
        <div className="md:col-span-2 md:px-[30px]">
          <div>
            <button
              onClick={() => setTab("requests")}
              className={`${
                tab === "requests" && "bg-primaryColor text-white font-normal"
              }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7  border-primaryColor`}
            >
              Requests
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
          <section>
            <div className="container">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5 ">
                {admin?.doctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

// Data fetching Function for get request data of doctor
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const cookieToken = context.req.cookies.token;

    const { data } = await axios.get(`${BASE_URL}/admin/profile`, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });

    return {
      props: {
        admin: data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Error fetching doctor data",
      },
    };
  }
}
