import { doctors } from "@/public/assets/data/doctors";
import DoctorCard from "@/components/Doctors/DoctorCard";
import Testimonial from "@/components/Testimonial/Testimonial";

export default function Doctors() {
  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className=" heading">Find a Doctor</h2>
          <div className="max-w-[578px] mt-[30px] mx-auto bg-[#0866ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 px-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Doctor"
            />
            <button className="btn mt-0 rounded-r-md rounded-[0px]">
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5  ">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
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
  );
}

// export async function getStaticProps() {}
