import axios from "axios";
import {
  capitalize,
  dateToString,
  timeslotByDate,
} from "@/utils/heplerFunction";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BASE_URL } from "@/utils/config";
import { useSelector } from "react-redux";
import Slot from "./Slot";
import Calander from "./Calander";

//Memoize the component to prevent unnecessary re-renders
const Timeslot = React.memo(({ timeslots, fees }) => {
  const sortedTimeslots = useMemo(() => {
    return timeslots.slice().sort((a, b) => {
      const order = ["morning", "afternoon", "evening"];

      return (
        order.indexOf(Object.keys(a)[0]) - order.indexOf(Object.keys(b)[0])
      );
    });
  }, [timeslots]);

  const router = useRouter();
  const { slug } = router.query;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(dateToString(new Date()));
  const [newTimeslots, setNewTimeslots] = useState(sortedTimeslots);

  const { accessToken } = useSelector((state) => state.user);

  const openDetails = (time, period) => {
    setSelectedTime(time);
    setSelectedSlot(period);
    setDialogOpen(true);
  };

  const onChangeDate = (newDateStr) => {
    const formattedDate = dateToString(newDateStr);

    setSelectedDate(formattedDate);
    setNewTimeslots(timeslotByDate(sortedTimeslots, formattedDate));
  };

  const confirmBooking = async () => {
    setDialogOpen(false);

    const data = {
      bookingDate: selectedDate,
      time: selectedTime,
      slotPhase: selectedSlot,
    };
    const booking = await axios.post(
      `${BASE_URL}/checkout-session/${slug}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(booking);
    // Reset selectedTime and selectedSlot if needed
    setSelectedTime("");
    setSelectedSlot("");
  };

  return (
    <>
      <div
        className={`${
          dialogOpen ? "hidden" : ""
        } container flex items-center justify-center gap-5  flex-col md:flex-row `}
      >
        <div className="p-2">
          <Calander onChange={onChangeDate} />
        </div>
        <div className="md:w-[450px]  ">
          {newTimeslots.map((slot, index) =>
            Object.keys(slot).map((period, periodIndex) => (
              <Slot
                slot={slot}
                period={period}
                openDetails={openDetails}
                key={`${index}-${periodIndex}`}
              />
            ))
          )}
        </div>
      </div>

      {dialogOpen && (
        <div className="w-full h-full bg-[#ddf2fc] p-8 mt-[-35px] mb-[-35px]   ">
          <div className="">
            <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
              Selected Date:{" "}
              <span className="text-textColor ">{selectedDate}</span>
            </p>
            <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
              Selected Slot:{" "}
              <span className="text-textColor ">{selectedSlot}</span>
            </p>
            <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
              Selected Time:{" "}
              <span className="text-textColor ">{selectedTime}</span>
            </p>
            <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
              Appointment Fees: <span className="text-textColor ">{fees}</span>
            </p>

            <button
              onClick={confirmBooking}
              className="btn px-2 w-full rounded-md  bg-[#feb60d33] text-[#FEB60D] border border-solid hover:border-[#FEB60D]"
            >
              Confirm Booking
            </button>
          </div>

          <div
            className="absolute top-1 right-0 p-4 cursor-pointer text-primaryColor hover:text-red-600"
            onClick={() => setDialogOpen(false)}
          >
            <FaTimes />
          </div>
        </div>
      )}
    </>
  );
});

export default Timeslot;
