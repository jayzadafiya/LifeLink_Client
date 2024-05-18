import axios from "axios";
import Head from "next/head";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { searchDoctor, setDocterList } from "../../store/slices/doctorSlice";
import { BASE_URL } from "../../utils/config";
import { RootState, useAppDispatch } from "../../store/store";
import { Doctor } from "../../interfaces/Doctor";
import Error from "../../components/Error/Error";
import { DonorForm } from "../../interfaces/Forms";
import PaginationComponent from "../../components/Pagination/Pagination";
import { fetchData, setData, setPrevData } from "../../store/slices/pagination";

// Interface for components props type
interface DoctorsProps {
  doctors?: Doctor[];
  error?: any;
}

export default function Doctors({
  doctors,
  error,
}: DoctorsProps): React.JSX.Element {
  const query = useRef<HTMLInputElement>(null);

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

  // Function for doctor search
  const handleSearch = () => {
    const searchTerm = query.current?.value.trim();
    if (searchTerm !== "") {
      dispatch(setPrevData());

      dispatch(fetchData({ formData: searchTerm, page: 1, type: "doctor" }));
      if (query.current) {
        query.current.value = "";
      }
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
          <div className="max-w-[578px] mt-[30px] mx-auto bg-[#0866ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 px-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Doctor by name or specificatoins"
              ref={query}
            />
            <button
              className="btn mt-0 rounded-r-md rounded-[0px]"
              onClick={handleSearch}
            >
              Search
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
