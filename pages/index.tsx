import Image from "next/image";
import Link from "next/link";
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import DoctorList from "../components/Doctors/DoctorList";
import Error from "../components/Error/Error";

import heroImage01 from "../public/assets/images/hero-img01.png";
import heroImage02 from "../public/assets/images/hero-img02.png";
import heroImage03 from "../public/assets/images/hero-img03.png";
import icon01 from "../public/assets/images/icon01.png";
import icon02 from "../public/assets/images/icon02.png";
import icon03 from "../public/assets/images/icon03.png";
import featurImage from "../public/assets/images/feature-img.png";
import videoIcon from "../public/assets/images/video-icon.png";
import avatarImage from "../public/assets/images/avatar-icon.png";
import faqImg from "../public/assets/images/faq-img.png";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";
import axios from "axios";

import { BASE_URL } from "../utils/config";
import { BsArrowRight } from "react-icons/bs";
import { Doctor } from "../interfaces/Doctor";

interface HomeProps {
  doctors: Doctor[];
  error: any;
}

export default function Home({ doctors, error }: HomeProps): React.JSX.Element {
  if (error) {
    return <Error errMessage={error} />;
  }

  return (
    <>
      {/* hero Section start */}

      <section className="hero__section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
            <div>
              <div className="lg:w-[570px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                  we help patients live a healthy, longer life
                </h1>
                <p className="text__para">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Expedita adipisci consequatur error! Consequuntur, neque
                  accusantium? Nulla labore quia tenetur adipisci expedita
                  totam? Facere vel ab numquam iure inventore, fugit aut.
                </p>

                <button className="btn">Request an Appoitment</button>
              </div>

              {/* hero counter */}
              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    30+
                  </h2>
                  <span className="w-[85px] h-2 bg-yellowColor  block mt-[-10px]"></span>
                  <p className="text__para">Year of Experience</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    15+
                  </h2>
                  <span className="w-[80px] h-2 bg-purpleColor  block mt-[-10px]"></span>
                  <p className="text__para">Clinic Locations</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    100%
                  </h2>
                  <span className="w-[120px] h-2 bg-irisBlueColor  block mt-[-10px]"></span>
                  <p className="text__para">Patient Satisfaction</p>
                </div>
              </div>
              {/* hero counter */}
            </div>

            <div className="flex gap-[30px] justify-end">
              <div>
                <Image src={heroImage01} alt="DoctorImage" />
              </div>
              <div className="mt-[30px]">
                <Image
                  src={heroImage02}
                  alt="DoctorImage2"
                  className="w-full mb-[30px]"
                />
                <Image
                  src={heroImage03}
                  alt="DoctorImage3"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* hero Section end */}

      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto ">
            <h2 className="heading text-center">
              Providing the best medical services
            </h2>
            <p className="text__para text-center">
              Wolrd-class for everyone. Our health System offers unmatched
              expert health care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <Image src={icon01} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Doctor
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Wolrd-class for everyone. Our health System offers unmatched
                  expert health care
                </p>

                <Link
                  href="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px]  mx-auto flex  items-center justify-center group hover:bg-primaryColor hover:border-none  "
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-6" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <Image src={icon02} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Location
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Wolrd-class for everyone. Our health System offers unmatched
                  expert health care
                </p>

                <Link
                  href="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px]  mx-auto flex  items-center justify-center group hover:bg-primaryColor hover:border-none  "
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-6" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <Image src={icon03} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Book Appointment
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Wolrd-class for everyone. Our health System offers unmatched
                  expert health care
                </p>

                <Link
                  href="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px]  mx-auto flex  items-center justify-center group hover:bg-primaryColor hover:border-none  "
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <About />

      {/* services section  */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto ">
            <h2 className="heading text-center">Our medical services</h2>
            <p className="text__para text-center">
              World-class care for everyone. Our health System offers unmatched,
              expert health care
            </p>
          </div>
          <ServiceList />
        </div>
      </section>
      {/* services section end */}

      {/* featur section */}
      <section>
        <div className="container">
          <div className="flex   justify-between flex-col  lg:flex-row">
            {/* featur content */}
            <div className="xl:w-[670px]">
              <h2 className="heading">
                Get virtual tretment <br /> anytime
              </h2>
              <ul className="pl-4">
                <li className="text__para">
                  1. Schedule the appointment directly
                </li>
                <li className="text__para">
                  2. Search for your physician here, and contact their office
                </li>
                <li className="text__para">
                  3. View our physician who are accepting new patients, use the
                  online scheduling tool to select an appointment time
                </li>
              </ul>

              <Link href="/">
                <button className="btn">Learn More</button>
              </Link>
            </div>

            {/* featurs img */}
            <div className="relative z-10 xl:w-[770px] flex justify-center lg:justify-end mt-[50px] lg:mt-0  ">
              <Image src={featurImage} alt="" className="w-3/4" />

              <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[6px] lg:gap-3">
                    <p className="text-[10px] leading-[10px] lg:text-[14px]  lg:leading-5 text-headingColor font-[600]">
                      Tue, 24
                    </p>

                    <p className="text-[10px] leading-[10px] lg:text-[14px]  lg:leading-5 text-textColor font-[400]">
                      10:00AM
                    </p>
                  </div>

                  <span className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]">
                    <Image src={videoIcon} alt="" />
                  </span>
                </div>

                <div className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px]  lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4  rounded-full">
                  Consultation
                </div>

                <div className="flex items-center gap-[6px]  lg:gap-[10px] mt-2 lg:mt-[18px]">
                  <Image src={avatarImage} alt="" />
                  <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor">
                    Jay Zadafiya
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* featur section end */}

      {/* get our Doctores */}
      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto ">
            <h2 className="heading text-center">Our great Doctores</h2>
            <p className="text__para text-center">
              Wolrd-class for everyone. Our health System offers unmatched
              expert health care
            </p>
          </div>
          <DoctorList doctors={doctors} />
        </div>
      </section>

      {/* get our Doctores end */}

      {/* faq seaction */}
      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 hidden md:block">
              <Image src={faqImg} alt="" />
            </div>
            <div className="w-full mt-[33px] md:w-1/2">
              <h2 className="heading text-[34px]">
                Most quations by our beloved patients
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>
      {/* faq seaction end */}

      {/* testimonial start */}
      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto ">
            <h2 className="heading text-center">What out patient say</h2>
            <p className="text__para text-center">
              Wolrd-class for everyone. Our health System offers unmatched
              expert health care
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
      {/* testimonial start end */}
    </>
  );
}

// Data fetching Function for get Doctors list
export async function getStaticProps(): Promise<{
  props: Partial<HomeProps>;
}> {
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    return {
      props: {
        doctors: res.data,
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
