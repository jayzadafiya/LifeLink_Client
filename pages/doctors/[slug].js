import Image from "next/image";
import starIcon from "../../public/assets/images/Star.png";
import { useEffect, useState } from "react";
import DoctorAbout from "@/components/Doctors/DoctorAbout";
import FeedBack from "@/components/Doctors/FeedBack";
import SidePanel from "@/components/Doctors/SidePanel";
import { BASE_URL } from "@/utils/config";
import axios from "axios";

export default function DoctorDetails({ doctor, error }) {
  const [tab, setTab] = useState("about");
  console.log(tab);
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
    timeSlots,
    fees,
  } = doctor;

  // Reset the tab to about whenever the doctor prop changes
  useEffect(() => {
    setTab("about");
  }, [doctor]);

  return (
    <>
      {error && <Error Error errMessgae={error} />}
      {!error && (
        <section>
          <div className="max-w-[1170px] px-5 mx-auto">
            <div className="grid md:grid-cols-3 gap-[50px]">
              <div className="md:col-span-2">
                <div className="flex items-center gap-5">
                  <figure>
                    <Image
                      src={photo}
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
                      tab === "feedback" &&
                      "border-b border-solid border-primaryColor"
                    } py-2 px-5 mr-5 tetxt-[16px] leading-7 text-headingColor font-semibold  `}
                    onClick={() => setTab("feedback")}
                  >
                    Feedback
                  </button>
                </div>

                <div className="mt-[50px] ">
                  {tab === "about" && (
                    <DoctorAbout
                      name={name}
                      about={about}
                      qualifications={qualifications}
                      experiences={experiences}
                    />
                  )}
                  {tab === "feedback" && (
                    <FeedBack reviews={reviews} totalRating={totalRating} />
                  )}
                </div>
              </div>
              <div>
                <SidePanel
                  doctorId={doctor._id}
                  timeSlots={timeSlots}
                  fees={fees}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function getStaticProps(context) {
  try {
    const { slug } = context.params;
    const res = await axios.get(`${BASE_URL}/doctors/${slug}`);

    return {
      props: {
        doctor: res.data,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
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
export async function getStaticPaths() {
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    const doctors = res.data;

    // Get the paths we want to pre-render based on doctors
    const paths = doctors.map((doctor) => ({
      params: { slug: doctor._id },
    }));

    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return { paths: [], fallback: false };
  }
}
