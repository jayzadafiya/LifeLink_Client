import DoctorCard from "../Doctors/DoctorCard";

export default function MyBookings({ appointentments }) {
  return (
    <div>
      {appointentments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          You did not book any doctro yet!
        </h2>
      )}

      {appointentments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {appointentments.map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
      )}
    </div>
  );
}
