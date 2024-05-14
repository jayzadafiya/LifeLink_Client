import Image from "next/image";
import Link from "next/link";
import avatarImg from "../../public/assets/images/avatar-icon.png";

import {
  capitalize,
  filteredAppointments,
  formateDate,
  sortedAppointments,
} from "../../utils/heplerFunction";
import { TableRow, TableCell } from "@mui/material";
import { Appointment } from "../../interfaces/Doctor";
import { FaFilePrescription } from "react-icons/fa6";
import { useAppDispatch } from "../../store/store";
import { setAppointmentData } from "../../store/slices/doctorSlice";
import { useRouter } from "next/router";

// Interface for components props type
interface AppointmentPageProps {
  appointments: Appointment[];
  page: number;
  rowsPerPage: number;
  order: "asc" | "desc";
  searchTerm: string;
  userType: string;
}

export default function AppointmentPage({
  appointments,
  page,
  rowsPerPage,
  order,
  searchTerm,
  userType,
}: AppointmentPageProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Condition for set appointment data base on userType
  let filteredAppointment = sortedAppointments(appointments, order);
  if (userType !== "doctor") {
    filteredAppointment = filteredAppointments(filteredAppointment, searchTerm);
  }
  // If search term is not empty and no appointments are found, display a message
  if (searchTerm !== "" && filteredAppointment.length === 0) {
    return (
      <TableCell className="p-4 text-headingColor text-[16px] font-semibold border-0 ">
        Docter not found
      </TableCell>
    );
  }

  const handleScriptClick = (item: Appointment) => {
    dispatch(setAppointmentData(item));

    router.push(`/prescription/${item._id}`);
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
                        ? item.user?.name
                        : item.doctor?.name
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
              {item.isPaid ? (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 bg-green-500 mr-2"></div>
                  Paid
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 bg-red-500 mr-2"></div>
                  Unpaid
                </div>
              )}
            </TableCell>
            <TableCell>{item.fees}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>{formateDate(item.bookingDate)}</TableCell>
            <TableCell>
              <button onClick={() => handleScriptClick(item)}>
                <FaFilePrescription className="text-[24px] ml-2" />
              </button>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
