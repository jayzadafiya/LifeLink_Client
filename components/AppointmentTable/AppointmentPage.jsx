import Image from "next/image";
import dayjs from "dayjs";
import { TableRow, TableCell } from "@mui/material";
import { capitalize, formateDate } from "@/utils/heplerFunction";

export default function AppointmentPage({
  appointments,
  page,
  rowsPerPage,
  order,
  searchTerm,
  userType,
}) {
  // Function to sort appointments based on booking date and time
  const sortedAppointments = () => {
    const comparator = (a, b) => {
      const dateA = dayjs(a.bookingDate + " " + a.time);
      const dateB = dayjs(b.bookingDate + " " + b.time);

      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    };

    return appointments.sort(comparator);
  };

  // Function to filter appointments based on search term
  const filteredAppointments = () => {
    return sortedAppointments().filter((appointment) =>
      appointment.doctor.name.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  let filteredAppointment;
  if (userType === "doctor") {
    filteredAppointment = sortedAppointments();
  } else {
    filteredAppointment = filteredAppointments();
  }

  // If search term is not empty and no appointments are found, display a message
  if (searchTerm !== "" && filteredAppointment.length === 0) {
    return (
      <p className="p-4 text-headingColor text-[16px] font-semibold">
        Docter not found
      </p>
    );
  }

  // Render the filtered appointments within the specified range
  return filteredAppointment.slice(startIndex, endIndex).map((item) => (
    <TableRow key={item._id}>
      <TableCell>
        <div className="flex items-center">
          <Image
            src={userType === "doctor" ? item.user?.photo : item.doctor?.photo}
            alt=""
            className="rounded-full"
            width={40}
            height={40}
          />
          <div className="pl-3">
            <div className="text-base font-semibold">
              {capitalize(
                userType === "doctor" ? item.user?.name : item.doctor?.name
              )}
            </div>
            <div className="text-gray-500">
              {userType === "doctor" ? item.user?.email : item.doctor?.email}
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
    </TableRow>
  ));
}
