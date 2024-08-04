import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Updated import path
import { mockDataInvoices } from "../data/mockData"; // Updated import path
import Header from "../Components/Header"; // Updated import path

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "customerId", headerName: "CustomerID", flex: 1 },
    { field: "id", headerName: "Test ID", flex: 1 },
    {
      field: "cost",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.primary[500]}>
          {params.row.paymentMethod}
        </Typography>
      ),
    },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Typography color={params.row.status === "Results Uploaded" ? colors.greenAccent[500] : colors.redAccent[500]}>
          {params.row.status}
        </Typography>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: colors.primary[400] + " !important", // Ensure background color of grid
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: colors.primary[500] + " !important", // Maroon color for text
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[800] + " !important", // Maroon
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400] + " !important", // Maroon
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[800] + " !important", // Maroon
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#ffffff !important", // White background for rows
            "&:hover": {
              backgroundColor: colors.primary[500] + " !important", // Darker maroon on hover
            },
          },
        }}
      >
        <DataGrid checkboxSelection rows={mockDataInvoices} columns={columns} />
      </Box>
    </Box>
  );
};

export default Invoices;
