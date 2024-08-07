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
  const [file, setFile] = useState(null);
  const [uploadingTestId, setUploadingTestId] = useState(null);
  const [uploadingCustomerId, setUploadingCustomerId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/bookedlabtests");
      const mappedTests = response.data.map((test, index) => ({
        id: test["book test id"] || index,
        testId: test["test id"],
        customerId: test["customer id"],
        test: test["test name"],
        animal: test["animal"],
        payment: test["payment status"],
        results: test["url"],
      }));
      setTests(mappedTests);
      console.log(mappedTests)
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadClick = (testId, customerId) => {
    setUploadingTestId(testId);
    setUploadingCustomerId(customerId);
    document.getElementById('fileInput').click();
  };
  

  const handleViewClick = async (testId, customerId) => {
    try {
      const response = await axios.post("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/getTestResult", {
        testId,
        customerId
      }, { responseType: 'blob' });

      const file = new Blob([response.data], { type: response.headers['content-type'] });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };


  useEffect(() => {
    if (file && uploadingTestId && uploadingCustomerId) {
      uploadFileToBackend();
    }
  }, [file, uploadingTestId, uploadingCustomerId]);

  const uploadFileToBackend = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("testId", uploadingTestId);
    formData.append("customerId", uploadingCustomerId);

    try {
      const response = await axios.post("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/updateTestResult", formData);
      const { url } = response.data;
      setUploadedUrls((prev) => ({
        ...prev,
        [uploadingTestId]: url,
      }));
      setFile(null);
      setUploadingTestId(null);
      setUploadingCustomerId(null);
      fetchTests();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "testId", headerName: "Test ID" },
    { field: "customerId", headerName: "Customer ID", flex: 1 },
    { field: "test", headerName: "Test", flex: 3 },
    { field: "animal", headerName: "Animal", flex: 1 },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: (cellParams) => <Switch checked={cellParams.value === "Paid"} />,
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
        onClick={() => cellParams.value ? handleViewClick(cellParams.row.testId, cellParams.row.customerId) 
          : handleUploadClick(cellParams.row.testId, cellParams.row.customerId)}
      >
        {cellParams.value ? "View" : "Upload"}
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
        <DataGrid rows={tests} columns={columns} getRowId={(row) => row.id} />
      </Box>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
    </Box>
  );
};

export default Team;