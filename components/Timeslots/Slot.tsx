import { capitalize } from "@mui/material";
import React from "react";
import { SlotData, Timeslots } from "../../interfaces/Doctor";

// Interface for components props type
interface SlotProps {
  slot: Timeslots;
  period: string;
  openDetails: (time: string, period: string) => void;
}

export default function Slot({
  slot,
  period,
  openDetails,
}: SlotProps): React.JSX.Element {
  const slots = slot[period as keyof Timeslots] as SlotData[];

  return (
    <>
      <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
        {capitalize(period)}
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3  mb-4">
        {slots.map(({ time }: { time: string }, timeIndex: number) => (
          <div
            key={`${period}-${timeIndex}`}
            className="p-2 md:p-4 w-[80px] bg-[#01b5c533] text-[#01B5C5] hover:bg-[#01B5C5]  hover:text-white  rounded cursor-pointer overflow-hidden"
            onClick={() => openDetails(time, period)}
          >
            <p className="text-center  ">{time}</p>
          </div>
        ))}
      </div>
    </>
  );
}
