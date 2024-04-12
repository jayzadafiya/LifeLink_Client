import axios from "axios";
import { capitalize } from "@/utils/heplerFunction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BASE_URL } from "@/utils/config";
import { useSelector } from "react-redux";

//Memoize the component to prevent unnecessary re-renders
const Timeslot = React.memo(({ timeslots, fees }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const { accessToken } = useSelector((state) => state.user);

  timeslots.sort((a, b) => {
    const order = ["moring", "afternoon", "evening"];
    return order.indexOf(Object.keys(a)[0]) - order.indexOf(Object.keys(b)[0]);
  });

  const openDetails = (time, period) => {
    setSelectedTime(time);
    setSelectedSlot(period);
    setDialogOpen(true);
  };

  const confirmBooking = async () => {
    setDialogOpen(false);

    const currentDate = new Date().toISOString().split("T")[0];

    const data = {
      bookingDate: currentDate,
      time: selectedTime,
      slotPhase: selectedSlot,
    };
    console.log(data);
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
      {!dialogOpen &&
        timeslots.map((slot) =>
          Object.keys(slot).map((period) => (
            <div key={period}>
              <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                {capitalize(period)}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3  mb-4">
                {slot[period]?.map((time, index) => (
                  <div
                    key={`${period}-${index}`}
                    className="p-2 md:p-4 w-[80px] bg-[#01b5c533] rounded-md cursor-pointer"
                    onClick={() => openDetails(time, period)}
                  >
                    <p className="text-center text-[#01B5C5] ">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      {dialogOpen && (
        <div className="w-full h-[200px] overflow-hidden">
          <dialog open={true} className=" w-full h-full p-4 mt-[-35px]   ">
            <div className="mt-4">
              <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
                Selected Slot:{" "}
                <span className="text-textColor ">{selectedSlot}</span>
              </p>
              <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
                Selected Time:{" "}
                <span className="text-textColor ">{selectedTime}</span>
              </p>
              <p className="text-[16px] leading-6 font-bold mb-4 mt-0">
                Appointment Fees:{" "}
                <span className="text-textColor ">{fees}</span>
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
          </dialog>
        </div>
      )}
    </>
  );
});

export default Timeslot;
