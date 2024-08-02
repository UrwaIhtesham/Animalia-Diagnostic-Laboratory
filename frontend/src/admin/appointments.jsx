import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "./comps/Header"; // Updated import path
import { tokens } from "../theme"; // Updated import path
import { mockDataAppointments } from "./data/mockData";

const Appointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Add a unique id property to each row in the mockDataAppointments
  const rows = mockDataAppointments.map((row, index) => ({
    ...row,
    id: `${row.customerId}-${row.doctorId}-${index}`, // Generate a unique id
  }));

  const columns = [
    { field: "id", headerName: "Customer ID" },
    { field: "doctorId", headerName: "Doctor ID" },
    { field: "doctorName", headerName: "Doctor Name", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "payment", headerName: "Payment", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Appointments" subtitle="Manage appointments" />
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: colors.primary[500],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[800],
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(even)": {
              backgroundColor: colors.primary[100],
            },
            "&:nth-of-type(odd)": {
              backgroundColor: colors.primary[200],
            },
            "& .MuiDataGrid-cell": {
              color: colors.primary[500],
            },
          },
        }}
      >
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </Box>
    </Box>
  );
};

export default Appointments;
