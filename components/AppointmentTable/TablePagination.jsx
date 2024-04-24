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
import Head from "next/head";
import AppointmentPage from "./AppointmentPage";
import { useState } from "react";
import { formateDate } from "@/utils/heplerFunction";

export default function AppointmentTablePagination({ type, appointments }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("bookingDate");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle sorting request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Function to handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  return (
    <div>
      {/* <Head>
        <title>Appointment page</title>
        <meta
          name="description"
          content="User profile setting and appointment data"
        />
      </Head> */}

      {appointments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          {`You did not ${
            type === "user" ? " book " : " have"
          } any appointment yet!`}
        </h2>
      )}

      {appointments.length > 0 && (
        <>
          {type === "user" && (
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
                <TableCell>Doctor Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fees</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "bookingDate"}
                    direction={orderBy === "bookingDate" ? order : "asc"}
                    onClick={() => handleRequestSort("bookingDate")}
                  >
                    Booked For
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AppointmentPage
                appointments={appointments}
                page={page}
                rowsPerPage={rowsPerPage}
                order={order}
                searchTerm={searchTerm}
                userType={type}
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
