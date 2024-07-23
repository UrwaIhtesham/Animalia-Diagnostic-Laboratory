import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataAppointments } from "../../data/mockData";
import Header from "../../components/Header";

const Appointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(mockDataAppointments);
  const columns = [
    { field: "customerId", headerName: "Customer ID", flex: 1 },
    { field: "doctorId", headerName: "Doctor ID", flex: 1 },
    { field: "doctorName", headerName: "Doctor Name", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) => (
        <Typography color={params.row.payment === "Done" ? colors.greenAccent[500] : colors.redAccent[500]}>
          {params.row.payment}
        </Typography>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Appointments" subtitle="List of Appointments" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: colors.primary[500], // Maroon color for text
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[800], // Maroon
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400], // Maroon
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[800], // Maroon
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-row": {
            '&:nth-of-type(even)': {
              backgroundColor: colors.primary[100], // Light maroon for even rows
            },
            '&:nth-of-type(odd)': {
              backgroundColor: colors.primary[200], // Slightly darker maroon for odd rows
            },
          },
        }}
      >
        <DataGrid
          rows={mockDataAppointments}
          columns={columns}
          getRowId={(row) => row.customerId} // Ensure unique IDs for rows
          pageSize={10} // Add page size to display rows
        />
      </Box>
    </Box>
  );
};

export default Appointments;
