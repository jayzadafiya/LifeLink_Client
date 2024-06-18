import Image from "next/image";
import axios from "axios";
import Head from "next/head";
import DoctorAbout from "../../components/Doctors/DoctorAbout";
import FeedBack from "../../components/Doctors/FeedBack";
import SidePanel from "../../components/Doctors/SidePanel";
import starIcon from "../../public/assets/images/Star.png";
import Error from "../../components/Error/Error";
import Cookies from "js-cookie";
import avatarImg from "../../public/assets/images/doctor-img01.png";

import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/config";
import { capitalize, decodeToken } from "../../utils/heplerFunction";
import { Doctor, Timeslots } from "../../interfaces/Doctor";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";

// Interface for components props type
interface DoctorDetailsProps {
  doctor: Doctor;
  error: any;
  timeslots: Timeslots[];
}

export default function DoctorDetails({
  doctor,
  error,
  timeslots,
}: DoctorDetailsProps): React.JSX.Element {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("about");

  const token = Cookies.get("token");

  if (error || !doctor) {
    return <Error errMessage={error} />;
  }

  const {
    name,
    averageRating,
    totalRating,
    photo,
    bio,
    about,
    specialization,
    experiences,
    qualifications,
    reviews,
    fees,
    address,
    timeSlots_data,
  } = doctor;

  // Reset the tab to about whenever the doctor prop changes
  useEffect(() => {
    setTab("about");

    if (token) {
      const payload = decodeToken(token);

      if (payload?.role === "admin") {
        setIsAdmin(true);
      }
    }
  }, [doctor]);

  return (
    <>
      {!error && (
        <section>
          <Head>
            <title>{`Dr.${capitalize(doctor?.name)}'s Detail Page`}</title>
            <meta name="description" content="Doctor profile page" />
          </Head>
          <div className="max-w-[1170px] px-5 mx-auto">
            <div className="grid md:grid-cols-3 gap-[50px]">
              <div className="md:col-span-2">
                <div className="flex items-center gap-5">
                  <figure>
                    <Image
                      src={photo || avatarImg}
                      alt=""
                      className="w-full"
                      width={200}
                      height={200}
                    />
                  </figure>
                  <div className="">
                    <span
                      className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold
             rounded "
                    >
                      {specialization}
                    </span>
                    <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold ">
                      {name}
                    </h3>
                    <div className="flex items-center gap-[6px]">
                      <span className="flex items-center gap-[6px] text-[14px] leading-5lg:text-[16px] lg:leading-7 font-semibold text-headingColor ">
                        <Image src={starIcon} alt="" />
                        {averageRating}
                      </span>
                      <span className=" text-[14px] leading-5lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                        ({totalRating})
                      </span>
                    </div>

                    <p className=" text__para tetx-[14px]  leading-6  md:text-[15px] lg:max-w-[398px]">
                      {bio}
                    </p>
                  </div>
                </div>

                <div className="mt-[50px] border-b border-solid border-[#g066ff34]">
                  <button
                    className={`${
                      tab === "about" &&
                      "border-b border-solid border-primaryColor"
                    } py-2 px-5 mr-5 tetxt-[16px] leading-7 text-headingColor font-semibold   `}
                    onClick={() => setTab("about")}
                  >
                    About
                  </button>
                  <button
                    className={`${
                      isAdmin
                        ? "hidden"
                        : `${tab === "feedback"} &&
                          "border-b border-solid border-primaryColor"
                     py-2 px-5 mr-5 tetxt-[16px] leading-7 text-headingColor font-semibold} `
                    }`}
                    onClick={() => setTab("feedback")}
                  >
                    Feedback
                  </button>
                </div>

                <div className="mt-[50px] ">
                  <div className={`${tab !== "about" ? "hidden" : ""}`}>
                    <DoctorAbout
                      name={name}
                      about={about}
                      qualifications={qualifications}
                      experiences={experiences}
                    />
                  </div>
                  <div
                    className={`${
                      !isAdmin && tab !== "feedback" ? "hidden" : ""
                    }`}
                  >
                    <FeedBack
                      reviews={reviews}
                      totalRating={totalRating || 0}
                    />
                  </div>
                </div>
              </div>
              <div>
                <SidePanel
                  timeslotsData={timeSlots_data}
                  timeslots={timeslots}
                  fees={fees}
                  address={address}
                  isAdmin={isAdmin}
                  doctorId={doctor._id}
                  status={doctor.isApproved}
                  documentLink={doctor.document}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// // Static function for get data of doctors
// export async function getStaticProps(
//   context: GetStaticPropsContext
// ): Promise<{ props: Partial<DoctorDetailsProps> }> {
//   try {
//     const slug: string | string[] | undefined = context.params?.slug;

//     if (!slug) {
//       return {
//         props: {
//           error: "Slug parameter is missing.",
//         },
//       };
//     }
//     const res = await axios.get(`${BASE_URL}/doctors/${slug}`);

//     return {
//       props: {
//         doctor: res.data.doctor,
//         timeslots: res.data.timeslots,
//       },
//     };
//   } catch (error: any) {
//     return {
//       props: {
//         error:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Error fetching doctor data",
//       },
//     };
//   }
// }

// // Static function for generate page at build time
// export async function getStaticPaths() {
//   try {
//     const res = await axios.get(`${BASE_URL}/doctors`);
//     const doctors: Doctor[] = res.data;

//     // Get the paths we want to pre-render based on doctors
//     const paths = doctors.map((doctor) => ({
//       params: { slug: doctor._id },
//     }));

//     return { paths, fallback: "blocking" };
//   } catch (error) {
//     console.error("Error fetching doctor data:", error);
//     return { paths: [], fallback: "blocking" };
//   }
// }

//use serverside function because of we habe to make api request base on token role
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { slug } = context.query;
    const { token } = context.req.cookies;

    if (token) {
      const decode = decodeToken(token);

      if (decode.role === "admin") {
        const { data } = await axios.get(`${BASE_URL}/update-doctor/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data)
          return {
            props: {
              doctor: data,
            },
          };
      }
    }
    const { data } = await axios.get(`${BASE_URL}/doctors/${slug}`);
    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        doctor: data.doctor,
        timeslots: data.timeslots,
      },
    };
  } catch (error: any) {
    return {
      notFound: true,
    };
  }
}
