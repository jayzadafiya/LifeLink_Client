import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import avatarImg from "../../public/assets/images/avatar-icon.png";
import io from "socket.io-client";
import Cookies from "js-cookie";
import {
  capitalize,
  decodeToken,
  filteredAppointments,
  formateDate,
  sortedAppointments,
} from "../../utils/heplerFunction";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Appointment } from "../../interfaces/Doctor";
import { useAppDispatch } from "../../store/store";
import { setAppointmentData } from "../../store/slices/doctorSlice";
import { TableRow, TableCell } from "@mui/material";
import { FaFilePrescription } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { BASE_URL } from "../../utils/config";
import { Socket } from "socket.io-client";
import { useSocket } from "../../context/SocketContext";

// let socket: Socket;

// Interface for components props type
interface AppointmentPageProps {
  appointments: Appointment[];
  page: number;
  rowsPerPage: number;
  order: "asc" | "desc";
  searchTerm: string;
  userType: string;
  appointmentType?: string;
}

export default function AppointmentPage({
  appointments,
  page,
  rowsPerPage,
  order,
  searchTerm,
  userType,
  appointmentType,
}: AppointmentPageProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { socket } = useSocket();
  const [statusChanges, setStatusChanges] = useState<{ [key: string]: string }>(
    {}
  );
  const [filteredAppointment, setFilteredAppointment] = useState<Appointment[]>(
    sortedAppointments(appointments, order)
  );

  const token = Cookies.get("token");
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    if (socket) {
      // const decode = decodeToken(token);

      // if (!socket) {
      //   socket = io("http://localhost:3002");
      // }

      // socket.on("connect", () => {
      //   console.log("Connected to WebSocket server");

      //   // Identify the client with their ID and role
      //   const identificationData = { id: decode.userId, role: decode.role };
      //   socket.emit("identify", identificationData);
      // });

      // Listen for new appointment
      socket.on("newBookingUpdate", (newBookingData: Appointment) => {
        setFilteredAppointment((prevAppointments) => {
          return sortedAppointments(
            [...prevAppointments, newBookingData],
            order
          );
        });
      });

      // Listen for appointment status change
      socket.on(
        "bookingStatus",
        ({ booking_id, status }: { booking_id: string; status: string }) => {
          setFilteredAppointment((prevAppointments) => {
            console.log(booking_id, status);
            return prevAppointments.map((appointment) =>
              appointment._id === booking_id
                ? { ...appointment, status }
                : appointment
            ) as Appointment[];
          });
        }
      );

      return () => {
        // Clean up the socket listener
        if (socket) {
          socket.off("connect");
          socket.off("newBookingUpdate");
          socket.off("bookingStatus");
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const result =
      userType !== "doctor" && searchTerm !== ""
        ? filteredAppointments(appointments, searchTerm)
        : appointments;

    setFilteredAppointment(sortedAppointments(result, order));
  }, [appointments, searchTerm]);

  // If search term is not empty and no appointments are found, display a message
  if (searchTerm !== "" && filteredAppointment.length === 0) {
    return (
      <TableCell className="p-4 text-headingColor text-[16px] font-semibold border-0 ">
        Docter not found
      </TableCell>
    );
  }

  const handleScriptClick = (item: Appointment) => {
    if (item.status !== "cancelled") {
      dispatch(setAppointmentData(item));

      router.push(`/prescription/${item._id}`);
    }
  };

  const handleAppointmentStatusChange = (id: string, value: string) => {
    setStatusChanges((prev) => {
      if (value === "pending") {
        const newStatusChanges = { ...prev };
        delete newStatusChanges[id];
        return newStatusChanges;
      }
      return { ...prev, [id]: value };
    });
  };

  const handleConfirmBtn = async (id: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

      if (confirmed) {
        await axios.patch(
          `${BASE_URL}/refund/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStatusChanges((prev) => {
          const newStatusChanges = { ...prev };
          delete newStatusChanges[id];
          return newStatusChanges;
        });
      }
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);
      return null;
    }
  };

  // Render the filtered appointments within the specified range
  return (
    <>
      {filteredAppointment
        .slice(startIndex, endIndex)
        .map((item: Appointment) => (
          <TableRow key={item._id}>
            <TableCell>
              <div className="flex items-center">
                <Image
                  src={
                    userType === "doctor"
                      ? item.user?.photo || avatarImg
                      : item.doctor?.photo || avatarImg
                  }
                  alt=""
                  className="rounded-full"
                  width={40}
                  height={40}
                />
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    {capitalize(
                      userType === "doctor"
                        ? item.user?.name || ""
                        : item.doctor?.name || ""
                    )}
                  </div>
                  <div className="text-gray-500">
                    {userType === "doctor"
                      ? item.user?.email
                      : item.doctor?.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {item.status === "pending" && (
                <div className="flex items-center">
                  {userType === "doctor" && appointmentType !== "history" ? (
                    <>
                      <div
                        className={`p-2 w-[78px] rounded  ${
                          statusChanges[item._id] === "cancelled"
                            ? "bg-red-200"
                            : "bg-yellow-200"
                        }`}
                      >
                        <select
                          name="mealTime"
                          className="leading-6 cursor-pointer text-[14px] appearance-none bg-transparent text-center"
                          onChange={(e) =>
                            handleAppointmentStatusChange(
                              item._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      {statusChanges[item._id] === "cancelled" && (
                        <button
                          type="button"
                          className="bg-green-500 text-white text-[20px] font-bold ml-2  rounded-full"
                          onClick={() => handleConfirmBtn(item._id)}
                        >
                          <GiConfirmed />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-[78px] text-center p-2 bg-yellow-200 rounded">
                      Pending
                    </div>
                  )}
                </div>
              )}
              {item.status === "complate" && (
                <div className="flex items-center">
                  <div className="w-[78px] p-2 bg-green-300 rounded">
                    Complate
                  </div>
                </div>
              )}
              {item.status === "cancelled" && (
                <div className="flex items-center">
                  <div className="w-[78px] p-2 bg-red-200 rounded">
                    Cancelled
                  </div>
                </div>
              )}
            </TableCell>
            <TableCell>{item.fees}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>{formateDate(item.bookingDate)}</TableCell>
            {!(userType === "doctor" && appointmentType === "history") && (
              <TableCell>
                <button
                  type="submit"
                  disabled={item.status === "cancelled"}
                  onClick={() => handleScriptClick(item)}
                >
                  <FaFilePrescription className="text-[24px] ml-2" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ))}
    </>
  );
}
