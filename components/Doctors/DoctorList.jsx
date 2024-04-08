import DoctorCard from "./DoctorCard";

export default function DoctorList({ doctors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px] ">
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
}
