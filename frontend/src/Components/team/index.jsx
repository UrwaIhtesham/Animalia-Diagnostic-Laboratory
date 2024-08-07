import { Box, Typography, useTheme, Switch, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTests } from "../../data/mockData";
import Header from "../../components/Header";
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
            color: colors.primary[500], // maroon color for text
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[800], // maroon
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400], // maroon
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[800], // maroon
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-row": {
            '&:nth-of-type(even)': {
              backgroundColor: colors.primary[100], // Ensuring alternate row color is not blue
            },
            '&:nth-of-type(odd)': {
              backgroundColor: colors.primary[200], // Ensuring alternate row color is not blue
            },
            '& .MuiDataGrid-cell': {
              color: colors.primary[500], // maroon color for text
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
