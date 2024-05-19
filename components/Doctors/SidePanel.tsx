import Model from "../Timeslots/Model";
import Timeslot from "../Timeslots/Timeslot";

import { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { capitalize, convertTime } from "../../utils/heplerFunction";
import { TimeSlot, Timeslots } from "../../interfaces/Doctor";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

// Interface for components props type
interface SidePanelProps {
  address?: string;
  timeslotsData?: TimeSlot[];
  fees: number;
  timeslots: Timeslots[];
  isAdmin: boolean;
  doctorId: string | undefined;
}

export default function SidePanel({
  address,
  timeslots,
  timeslotsData,
  fees,
  isAdmin,
  doctorId,
}: SidePanelProps): React.JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isReject, setIsReject] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();

  const { role } = useSelector((state: RootState) => state.user);

  const handelModel = () => {
    setOpen((prev) => !prev);
  };
  const handelRejectModel = async () => {
    if (isReject) {
      try {
        setIsReject((prev) => !prev);

        await axios.patch(`${BASE_URL}/admin/${doctorId}`, {
          message: message,
        });
        router.replace("/admin");
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);
        return null;
      }
    } else {
      setIsReject((prev) => !prev);
    }
  };

  const sortedTimeslots = useMemo(() => {
    if (!timeslotsData) return [];
    return timeslotsData.slice().sort((a, b) => {
      const order = ["morning", "afternoon", "evening"];
      return (
        order.indexOf(Object.values(a)[0]) - order.indexOf(Object.values(b)[0])
      );
    });
  }, [timeslotsData]);

  const handelAcceptBtn = async () => {
    try {
      await axios.patch(`${BASE_URL}/admin/${doctorId}`);
      router.replace("/admin");
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);
      return null;
    }
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

        {!isReject && (
          <button
            className={`${
              role === "doctor"
                ? "hidden"
                : "btn px-2 w-full rounded-md   btn-hover"
            }`}
            onClick={handelModel}
          >
            Book Appoitement
          </button>
        )}
        {isAdmin && (
          <>
            {!isReject && (
              <button
                className="btn px-2 w-full rounded-md bg-green-500  hover:border-green-500 hover:border-solid hover:border-[3px] hover:text-green-500 hover:bg-green-100 font-bold mt-4 text-[16px] leading-7"
                onClick={handelAcceptBtn}
              >
                Accept
              </button>
            )}
            {isReject && (
              <input
                type="text"
                name="message"
                className="form__input"
                placeholder="Enter reason for rejection "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            )}
            <button
              className="btn px-2 w-full rounded-md bg-red-500  hover:border-red-500 hover:border-solid hover:border-[3px] hover:text-red-500 hover:bg-red-100 text-[16px] leading-7 font-bold mt-4"
              onClick={handelRejectModel}
            >
              {isReject ? "Submit" : "Reject"}
            </button>
          </>
        )}
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
