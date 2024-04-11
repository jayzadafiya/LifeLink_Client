import Model from "../Timeslots/Model";
import { useState } from "react";
import Timeslot from "../Timeslots/Timeslot";

export default function SidePanel({ address, docotrId, timeslots, fees }) {
  const [open, setOpen] = useState(false);

  const handelModel = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
        <div className="flex items-center justify-between">
          <p className="text__para mt-0 font-semibold">Fees</p>
          <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold ">
            {fees}₹
          </span>
        </div>

        <div className="mt-[30px]">
          <p className="text__para mt-0 font-semibold text-headingColor text-[15px]">
            Clinic address:{" "}
            <span className="text-[15px] leading-6 text-textColor font-semibold">
              {address}
            </span>
          </p>

          {/* <ul className="mt-3">
          {timeSlots.map((slot, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semiboldr">
                
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semiboldr">
                {convertTime(slot.startingTime)} -{" "}
                {convertTime(slot.endingTime)}
              </p>
            </li>
          ))}
        </ul> */}
        </div>

        <button className="btn px-2 w-full rounded-md" onClick={handelModel}>
          Book Appoitement
        </button>
      </div>
      <Model open={open}>
        <Timeslot timeslots={timeslots} />
        <button onClick={handelModel}>close</button>
      </Model>
    </>
  );
}
