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

  let { doctorList, searchDoctorList } = useSelector(
    (state: RootState) => state.doctor
  );

  useEffect(() => {
    // docterList use for conditional dispatch action
    if (!doctorList) {
      dispatch(setDocterList(doctors));
    }
  }, [dispatch, doctors, doctorList]);

  // Function for doctor search
  const handleSearch = () => {
    const searchTerm = query.current?.value.trim();
    if (searchTerm !== "") {
      dispatch(searchDoctor(searchTerm));
    } else {
      searchDoctorList = [];
    }
  };

  return (
    <>
      {error && <Error errMessage={error} />}
      {!error && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5  ">
                {searchDoctorList &&
                  searchDoctorList.length > 0 &&
                  searchDoctorList.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}

                {!query.current?.value &&
                  doctors?.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}

                {query.current?.value.trim() !== "" &&
                  searchDoctorList?.length === 0 && <div>No Doctor found</div>}
              </div>
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
      )}
    </>
  );
}

// Data fetching Function for get data of Doctors
export async function getStaticProps(): Promise<{ props: DoctorsProps }> {
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
