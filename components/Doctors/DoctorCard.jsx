import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import starIcon from "../../public/assets/images/Star.png";
export default function DoctorCard({ doctor }) {
  const {
    _id,
    name,
    avgRating,
    totalRating,
    photo,
    specialization,
    totalPatients,
    experiences,
  } = doctor;
  return (
    <div className="p-3 lg:p-5">
      <div>
        <Image src={photo} alt="" className="w-full" width={300} height={300} />
      </div>

      <h2 className="text-[10px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700]">
        {name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
          {specialization}
        </span>

        <div className="flex items-center gap-[6px]">
          <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
            <Image src={starIcon} alt="" />
            {avgRating}
          </span>
          <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7  text-textColor">
            ( {totalRating} )
          </span>
        </div>
      </div>

      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <div className="">
          <h3 className="text-[16px] leading-7 lg:text-[16px] lg:leading-[30px] font-semibold ">
            +{totalPatients} patients
          </h3>
          <p className="text-[14px] leading-6 font-[400] text-textColor">
            At {experiences && experiences[0]?.place}
          </p>
        </div>
        <Link
          href={`/doctors/${_id}`}
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex  items-center justify-center group hover:bg-primaryColor hover:border-none  "
        >
          <BsArrowRight className="group-hover:text-white w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
