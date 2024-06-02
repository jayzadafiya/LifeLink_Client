import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import Cookies from "js-cookie";
import Error from "../../../components/Error/Error";
import Tabs from "../../../components/Doctors/Dashboard/Tabs";
import avtarImg from "../../../public/assets/images/doctor-img01.png";
import star from "../../../public/assets/images/Star.png";
import DoctorAbout from "../../../components/Doctors/DoctorAbout";
import Profile from "../../../components/Doctors/Dashboard/Profile";
import AppointmentTablePagination from "../../../components/AppointmentTable/TablePagination";
import PasswrodUpdate from "../../../components/PasswrodUpdate/PasswrodUpdate";

import { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { BASE_URL } from "../../../utils/config";
import { capitalize, decodeToken } from "../../../utils/heplerFunction";
import { Appointment, Doctor } from "../../../interfaces/Doctor";
import { GetServerSidePropsContext } from "next";
import { useSocket } from "../../../context/SocketContext";

// Interface for components props type
interface DashboardProps {
  initalDoctor: Doctor;
  appointments: { upcoming: Appointment[]; history: Appointment[] };
  error: any;
}

interface DoctorStatus {
  message?: string;
  isApproved?: string;
}

export default function Dashboard({
  initalDoctor,
  error,
  appointments,
}: DashboardProps): React.JSX.Element {
  const { socket } = useSocket();

  const token = Cookies.get("token");

  const [tab, setTab] = useState("overview");
  const [doctor, setDoctor] = useState<Doctor>(initalDoctor);
  const [doctorStatus, setDoctorStatus] = useState<DoctorStatus>({
    message: doctor.message,
    isApproved: doctor.isApproved,
  });

  useEffect(() => {
    if (token && socket) {
      const { userId, role } = decodeToken(token);

      socket.emit("identify", { id: userId, role });
      // Listen for appointment status change
      socket.on("doctorStatus", ({ message, isApproved }: DoctorStatus) => {
        setDoctorStatus((prevStatus) => ({
          ...prevStatus,
          isApproved,
          ...(message && { message }),
        }));
      });

      // Listen for get user updated data
      socket.on("updateDoctor", (updateData: Doctor) => {
        setDoctor(updateData);
      });

      return () => {
        // Clean up the socket listener
        socket.emit("removeIdentity", { id: userId });
        socket.off("updateDoctor");
        socket.off("bookingStatus");
      };
    }
  }, [socket]);

  if (error || !doctor) {
    return <Error errMessage={error} />;
  }

  return (
    <section>
      <Head>
        {(tab === "overview" || tab === "settings") && (
          <title>{`${capitalize(doctor?.name)}'s Profile`}</title>
        )}
        <meta
          name="description"
          content="doctor profile setting and appointment data"
        />
      </Head>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
          <Tabs tab={tab} setTab={setTab} />
          <div className="lg:col-span-2 ">
            <div
              className={`${
                doctorStatus?.isApproved === "approved" ? "hidden" : ""
              } flex flex-col items-start justify-evenly p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg`}
            >
              <div className="flex items-center justify-center">
                <FiInfo size={30} />

                <div className="ml-3 text-sm font-medium">
                  To get approval please complete your profile. We&apos;ll
                  review manually and approve within 3 Days
                </div>
              </div>

              <div className="ml-[42px] text-lg font-medium">
                {doctorStatus.message}
              </div>
            </div>

            <div className="mt-8">
              <div className={`${tab !== "overview" ? "hidden" : ""} mt-8`}>
                <div className="flex items-center gap-4 mb-18">
                  <figure className="max-w-[200px] max-h-[200]">
                    <Image
                      src={doctor.photo || avtarImg}
                      alt=""
                      width={200}
                      height={200}
                    />
                  </figure>

                  <div>
                    <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px]  font-semibold">
                      {doctor.specialization}
                    </span>

                    <h3 className="text-[22pz] leading-9 font-bold text-headingColor mt-3">
                      Dr.{doctor.name}
                    </h3>

                    <div className="flex items-center gP-[6px]">
                      <span className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                        <Image src={star} alt="" />
                        {doctor.averageRating}
                      </span>

                      <span className="text-textColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                        ({doctor.totalRating})
                      </span>
                    </div>

                    <div className="text__para font-[15px] lg:max-w-[390px] leading-6">
                      {doctor?.bio}
                    </div>
                  </div>
                </div>
                <DoctorAbout
                  name={doctor.name}
                  about={doctor.about}
                  qualifications={doctor.qualifications}
                  experiences={doctor.experiences}
                />
              </div>

              <div className={`${tab !== "appointments" ? "hidden" : ""}`}>
                <h2 className="text-primaryColor text-[24px] font-bold leading-9 mb-5">
                  Upcomming Appointments
                </h2>
                <AppointmentTablePagination
                  accessType="doctor"
                  appointments={appointments?.upcoming}
                />
              </div>

              <div className={`${tab !== "settings" ? "hidden" : ""}`}>
                <Profile doctor={doctor} setTab={setTab} />
              </div>

              <div className={`${tab !== "history" ? "hidden" : ""}`}>
                <h2 className="text-primaryColor  text-[24px] font-semibold leading-9 mb-5">
                  Appointment History
                </h2>
                <AppointmentTablePagination
                  accessType="doctor"
                  appointmentType="history"
                  appointments={appointments?.history}
                />
              </div>
              <div className={`${tab !== "updatePassword" ? "hidden" : ""}`}>
                <h2 className="text-primaryColor  text-[24px] font-semibold leading-9 mb-5">
                  Change Password
                </h2>
                <PasswrodUpdate />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Data fetching Function for get data of Doctor profile and appointment
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: Partial<DashboardProps> }> {
  try {
    const cookieToken = context.req.cookies.token;

    const res = await axios.get(`${BASE_URL}/doctors/profile`, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });

    return {
      props: {
        initalDoctor: res.data.doctorDetails,
        appointments: res.data.appointments,
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
