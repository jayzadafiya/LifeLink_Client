import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { capitalize, formateDate } from "@/utils/heplerFunction";

export default function AppointmentPage({
  appointments,
  page,
  rowsPerPage,
  order,
  orderBy,
  searchTerm,
}) {
  const sortedAppointments = () => {
    const comparator = (a, b) => {
      if (order === "asc") {
        return a[orderBy] - b[orderBy];
      } else {
        return b[orderBy] - a[orderBy];
      }
    };
    return appointments.sort(comparator);
  };

  const filteredAppointments = () => {
    return sortedAppointments().filter((appointment) =>
      appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const filteredAppointment = filteredAppointments();

  if (searchTerm !== "" && filteredAppointment.length === 0) {
    return (
      <p className="p-4 text-headingColor text-[16px] font-semibold">
        Docter not found
      </p>
    );
  }

  return filteredAppointment.slice(startIndex, endIndex).map((item) => (
    <TableRow key={item._id}>
      <TableCell>
        <div className="flex items-center">
          <div className="pl-3">
            <div className="text-base font-semibold">
              {capitalize(item.doctor.name)}
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
      <TableCell>{formateDate(item.bookingDate)}</TableCell>
      <TableCell>{item.time}</TableCell>
      <TableCell>{formateDate(item.createdAt)}</TableCell>
    </TableRow>
  ));
}
