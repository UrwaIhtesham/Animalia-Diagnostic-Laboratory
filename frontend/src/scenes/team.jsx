import { Box, Typography, useTheme, Switch, Button } from "@mui/material";

import { tokens } from "../theme"; // Updated path
import { mockDataTests } from "../data/mockData"; // Updated path
import Header from "../Components/Header"; // Updated path



import { DataGrid } from "@mui/x-data-grid";
import UploadIcon from "@mui/icons-material/Upload";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "testId", headerName: "Test ID" },
    { field: "customerId", headerName: "Customer ID", flex: 1 },
    { field: "test", headerName: "Test", flex: 1 },
    { field: "animal", headerName: "Animal", flex: 1 },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: () => <Switch />,
    },
    {
      field: "results",
      headerName: "Results",
      flex: 1,
      renderCell: () => (
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }}
        >
          Upload
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Tests" subtitle="Recent test records" />
      <Box
        m="40px 0 0 0"
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
            '&:nth-of-type(even)': {
              backgroundColor: colors.primary[100],
            },
            '&:nth-of-type(odd)': {
              backgroundColor: colors.primary[200],
            },
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={mockDataTests}
          columns={columns}
          getRowId={(row) => row.testId}
        />
      </Box>
    </Box>
  );
};

export default Team;
