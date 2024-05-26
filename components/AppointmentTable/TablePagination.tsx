import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  TextField,
} from "@mui/material";
import AppointmentPage from "./AppointmentPage";
import { useState } from "react";
import { Appointment } from "../../interfaces/Doctor";

// Interface for components props type
interface AppointmentTablePaginationProps {
  accessType: string;
  appointmentType?: string;
  appointments: Appointment[] | undefined;
}

export default function AppointmentTablePagination({
  accessType,
  appointments,
  appointmentType,
}: AppointmentTablePaginationProps): React.JSX.Element {
  const orderType = appointmentType === "history" ? "desc" : "asc";
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [order, setOrder] = useState<"asc" | "desc">(orderType);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to handle page change
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Function to handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle sorting request
  const handleRequestSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  // Function to handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  return (
    <div>
      {appointments && appointments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          {`You did not ${
            accessType === "user" ? " book " : " have"
          } any appointment yet!`}
        </h2>
      )}

      {appointments && appointments.length > 0 && (
        <>
          {accessType === "user" && (
            <TextField
              label="Search Doctor"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={handleSearchChange}
              className="mt-5"
            />
          )}
          <Table className="w-full text-left text-sm text-gray-500 mt-3">
            <TableHead>
              <TableRow>
                <TableCell>Doctor Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fees</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={true}
                    direction={order}
                    onClick={handleRequestSort}
                  >
                    Booked For
                  </TableSortLabel>
                </TableCell>
                {!(
                  accessType === "doctor" && appointmentType === "history"
                ) && <TableCell>Script</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              <AppointmentPage
                appointments={appointments}
                page={page}
                rowsPerPage={rowsPerPage}
                order={order}
                searchTerm={searchTerm}
                userType={accessType}
                appointmentType={appointmentType}
              />
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 8, 10]}
            component="div"
            count={appointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
}
