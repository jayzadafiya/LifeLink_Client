import axios from "axios";
import Head from "next/head";
import toast from "react-hot-toast";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import Error from "../../components/Error/Error";
import PaginationComponent from "../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/config";
import { RootState, useAppDispatch } from "../../store/store";
import { Doctor } from "../../interfaces/Doctor";
import { DonorForm } from "../../interfaces/Forms";
import { fetchData, setData, setPrevData } from "../../store/slices/pagination";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";

// Interface for components props type
interface DoctorsProps {
  doctors?: Doctor[];
  error?: any;
}

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || " "
);

export default function Doctors({
  doctors,
  error,
}: DoctorsProps): React.JSX.Element {
  const { loading } = useSelector((state: RootState) => state.pagination);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
  });
  const [statement, setStatement] = useState("");
  const [responeLoading, setResponseLoading] = useState(false);

  const dispatch = useAppDispatch();

  const renderItem = (doctor: Partial<Doctor | DonorForm>) => (
    <DoctorCard key={doctor._id} doctor={doctor as Doctor} />
  );

  useEffect(() => {
    // docterList use for conditional dispatch action
    if (doctors) {
      dispatch(setData({ data: doctors, page: 1 }));
    }
  }, [dispatch, doctors]);

  if (error) {
    return <Error errMessage={error} />;
  }

  const handelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function for doctor search
  const searchData = () => {
    try {
      dispatch(setPrevData());

      dispatch(fetchData({ formData, page: 1, type: "doctor" }));
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);
      return null;
    }
  };

  const getDoctorSpecialization = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (statement.trim() !== "") {
        setResponseLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `The user describes their health problem as: "${e.target.value}". Which type of doctor should they see?
      `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        setFormData((prev) => ({
          ...prev,
          specialization: text.split(" ")[0],
        }));
        setResponseLoading(false);
      }
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);
      return null;
    }
  };

  return (
    <>
      <Head>
        <title>Find a doctor</title>
        <meta name="description" content="Doctor search page " />
      </Head>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className=" heading">Find a Doctor</h2>
          <div className=" mt-[30px] mx-auto bg-[#0866ff2c] rounded-md flex flex-col items-center justify-between sm:flex-row">
            <input
              type="text"
              name="name"
              className="py-4 px-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor border-b-4 sm:border-0 sm:border-r-4"
              placeholder="Search Doctor by name "
              value={formData.name}
              onChange={handelInputChange}
            />
            <input
              type="text"
              name="specialization"
              className="py-4 px-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor  border-b-4 sm:border-0 sm:border-r-4"
              placeholder="Search Doctor by  specificatoins"
              value={formData.specialization}
              onChange={handelInputChange}
            />
            <input
              type="text"
              name="statement"
              className="py-4 px-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor border-b-4 sm:border-0"
              placeholder="Write your health problem"
              value={statement}
              onChange={(e) => {
                setStatement(e.target.value);
              }}
              onBlur={getDoctorSpecialization}
            />
            <button
              disabled={loading || responeLoading}
              className="btn mt-0 rounded-b-md sm:rounded-none sm:rounded-r-md rounded-[0px] w-full"
              onClick={searchData}
            >
              {loading || responeLoading ? (
                <HashLoader size={25} color="#ffffff" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <PaginationComponent renderItem={renderItem} type="doctor" />
        </div>
      </section>

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
    </>
  );
}

// Data fetching Function for get data of Doctors
export async function getStaticProps(): Promise<{ props: DoctorsProps }> {
  try {
    const res = await axios.get(`${BASE_URL}/doctors?page=1&limit=1`);

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
