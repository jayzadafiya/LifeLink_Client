import { formateDate } from "@/utils/heplerFunction";
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
import { useState } from "react";
import AppointmentPage from "./AppointmentPage";

export default function MyBookings({ appointments }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fees");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  return (
    <div>
      {appointments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          You did not book any doctro yet!
        </h2>
      )}

      {appointments.length > 0 && (
        <>
          <TextField
            label="Search Doctor"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Table className="w-full text-left text-sm text-gray-500 mt-3">
            <TableHead>
              <TableRow>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "fees"}
                    direction={orderBy === "fees" ? order : "asc"}
                    onClick={() => handleRequestSort("fees")}
                  >
                    Fees
                  </TableSortLabel>
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Booked On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AppointmentPage
                appointments={appointments}
                page={page}
                rowsPerPage={rowsPerPage}
                order={order}
                orderBy={orderBy}
                searchTerm={searchTerm}
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
