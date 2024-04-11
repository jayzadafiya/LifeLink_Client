export default function Timeslot({ timeslots }) {
  console.log(timeslots);
  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-hidden">
        {/* {timeslots?.map((timeslot, index) => (
          <div
            key={index}
            className=" p-2 md:p-4 w-[80px] bg-[#01b5c533] rounded-md  "
          >
            <p className="text-center text-[#01B5C5]">{timeslot.time}</p>
          </div>
        ))} */}
      </div>
    </>
  );
}
