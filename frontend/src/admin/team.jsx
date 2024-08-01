// import { Box, Typography, useTheme, Switch, Button } from "@mui/material";

// import { tokens } from "../theme"; // Updated path
// import Header from "./comps/Header"; // Updated path



// import { DataGrid } from "@mui/x-data-grid";
// import UploadIcon from "@mui/icons-material/Upload";
// import axios from "axios";
// import { useState, useEffect } from "react";

// const Team = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [tests, setTests] = useState([]);

//   useEffect(() => {
//     fetchTests();
//   }, []);

//   const fetchTests = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/bookedlabtests");
//       console.log(response.data);
//       const mappedTests = response.data.map((test, index) => ({
//         id: test["book test id"] || index,
//         testid: test["test id"],
//         customerid: test["customer id"],
//         test: test["test name"],
//         animal: test["animal"],
//         payment: test["payment status"],
//         results: test["url"],
//       }));
//       setTests(mappedTests);
//     } catch (error){
//       console.error("Error fetching tests:", error);
//     }
//   };

//   const columns = [
//     {field: "testappId", headerName: "Test Appointment ID"},
//     { field: "testId", headerName: "Test ID" },
//     { field: "customerId", headerName: "Customer ID", flex: 1 },
//     { field: "test", headerName: "Test", flex: 1 },
//     { field: "animal", headerName: "Animal", flex: 1 },
//     {
//       field: "payment",
//       headerName: "Payment",
//       flex: 1,
//       renderCell: (cellParams) => <Switch checked={cellParams.value === "Paid"}/>,
//     },
//     {
//       field: "results",
//       headerName: "Results",
//       flex: 1,
//       renderCell: (cellParams) => (
//         <Button
//           variant="contained"
//           startIcon={<UploadIcon />}
//           sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }}
//         >
//           {cellParams.value ? "View": "Upload"}
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="Tests" subtitle="Recent test records" />
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//             color: colors.primary[500],
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.primary[800],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.primary[800],
//           },
//           "& .MuiDataGrid-row": {
//             '&:nth-of-type(even)': {
//               backgroundColor: colors.primary[100],
//             },
//             '&:nth-of-type(odd)': {
//               backgroundColor: colors.primary[200],
//             },
//           },
//         }}
//       >
//         <DataGrid
//           rows={tests}
//           columns={columns}
//           getRowId={(row) => row.id}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Team;
import { Box, Typography, useTheme, Switch, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";
import { useState, useEffect } from "react";
import { tokens } from "../theme"; // Ensure path is correct
import Header from "./comps/Header"; // Ensure path is correct

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/bookedlabtests");
      console.log("Fetched data:", response.data);
      // Map the data to match the columns and ensure each row has a unique id
      const mappedTests = response.data.map((test, index) => ({
        id: test["book test id"] || index, // Ensure this ID is unique
        testId: test["test id"],
        customerId: test["customer id"],
        test: test["test name"],
        animal: test["animal"],
        payment: test["payment status"],
        results: test["url"], // or any other relevant field for results
      }));
      console.log("Mapped tests:", mappedTests);
      setTests(mappedTests); // Set mappedTests to the state
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "testId", headerName: "Test ID" },
    { field: "customerId", headerName: "Customer ID", flex: 1 },
    { field: "test", headerName: "Test", flex: 1 },
    { field: "animal", headerName: "Animal", flex: 1 },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: (cellParams) => <Switch checked={cellParams.value === "Paid"} />, // Assuming "Paid" means the switch is on
    },
    {
      field: "results",
      headerName: "Results",
      flex: 1,
      renderCell: (cellParams) => (
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }}
        >
          {cellParams.value ? "View" : "Upload"} {/* Adjust button text based on the presence of a URL */}
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
          rows={tests}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Team;
