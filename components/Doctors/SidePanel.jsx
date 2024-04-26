import Model from "../Timeslots/Model";
import Timeslot from "../Timeslots/Timeslot";

import { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { capitalize, convertTime } from "@/utils/heplerFunction";

export default function SidePanel({ address, timeslots, timeslotsData, fees }) {
  const [open, setOpen] = useState(false);

  const handelModel = () => {
    setOpen((prev) => !prev);
  };

  const sortedTimeslots = useMemo(() => {
    return timeslotsData.slice().sort((a, b) => {
      const order = ["morning", "afternoon", "evening"];
      return (
        order.indexOf(Object.values(a)[0]) - order.indexOf(Object.values(b)[0])
      );
    });
  }, [timeslotsData]);

  return (
    <>
      <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
        <div className="flex items-center justify-between">
          <p className="text__para mt-0 font-semibold">Fees</p>
          <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold ">
            {fees}₹
          </span>
        </div>

        <div className="mt-[15px]">
          <p className="text__para mt-0 font-semibold text-headingColor text-[15px]">
            Address:{" "}
            <span className="text-[15px] leading-6 text-textColor font-semibold text-wrap">
              {address}
            </span>
          </p>

          <ul className="mt-3">
            {sortedTimeslots.map((slot, index) => (
              <li
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <p className="text-[16px] leading-6 text-headingColor font-semiboldr">
                  {capitalize(slot.slot)}
                </p>
                <p className="text-[15px] leading-6 text-textColor font-semiboldr">
                  {convertTime(slot.startingTime)} -{" "}
                  {convertTime(slot.endingTime)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="btn px-2 w-full rounded-md   btn-hover"
          onClick={handelModel}
        >
          Book Appoitement
        </button>
      </div>
      <Model open={open}>
        <Timeslot timeslots={timeslots} fees={fees} />
        <div
          className="absolute top-2 right-1 p-3 cursor-pointer text-red-600"
          onClick={handelModel}
        >
          <FaTimes />
        </div>
      </Model>
    </>
  );
}
