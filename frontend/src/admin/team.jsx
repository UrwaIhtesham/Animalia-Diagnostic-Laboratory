import { Box, Typography, useTheme, Switch, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";
import { useState, useEffect } from "react";
import { tokens } from "../theme"; // Ensure path is correct
import Header from "./comps/Header"; // Ensure path is correct
import AWS from 'aws-sdk';
import {v4 as uuidv4} from 'uuid';

const S3_BUCKET = 'animalia-results-bucket';
const REGION = 'us-east-1';



const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tests, setTests] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bookedlabtests");
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
    { field: "test", headerName: "Test", flex: 3 },
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

// import { Box, Typography, useTheme, Switch, Button } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import UploadIcon from "@mui/icons-material/Upload";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { tokens } from "../theme"; // Ensure path is correct
// import Header from "./comps/Header"; // Ensure path is correct
// import AWS from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid';
// import Loading from "../Components/Loading/Loading";

// const S3_BUCKET = 'animalia-results-bucket';
// const REGION = 'us-east-1';

// AWS.config.update({
//   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//   region: REGION,
// });

// const s3 = new AWS.S3();

// const Team = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [tests, setTests] = useState([]);
//   const [file, setFile] = useState(null);
//   const [uploadingTestId, setUploadingTestId] = useState(null);
//   const [uploadingCustomerId, setUploadingCustomerId] = useState(null);
//   const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
//   const [fileNames, setFileNames] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchTests();
//   }, []);

//   const fetchTests = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/bookedlabtests");
//       console.log("Fetched data:", response.data);
//       const mappedTests = response.data.map((test, index) => ({
//         id: test["book test id"] || index,
//         testId: test["test id"],
//         customerId: test["customer id"],
//         test: test["test name"],
//         animal: test["animal"],
//         payment: test["payment status"],
//         results: test["url"],
//       }));
//       console.log("Environment Variables:", process.env);
//       console.log("access key id:", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
//       console.log("Mapped tests:", mappedTests);
//       setTests(mappedTests);
//     } catch (error) {
//       console.error("Error fetching tests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUploadClick = (testId, customerId) => {
//     setUploadingTestId(testId);
//     setUploadingCustomerId(customerId);
//     document.getElementById('fileInput').click();
//   };

//   useEffect(() => {
//     if (file && uploadingTestId && uploadingCustomerId) {
//        console.log("entered use efect.")
//       uploadFile();
//       console.log("File upload triggered...");
//     }
//   }, [file, uploadingTestId, uploadingCustomerId]);

//   const uploadFile = async () => {
//     const fileName = `${uuidv4()}-${file.name}`;
//     const params = {
//       Bucket: S3_BUCKET,
//       Key: fileName,
//       Body: file,
//       ContentType: file.type,
//       ACL: 'public-read',
//     };

//     try {
//       setLoading(true);
//       console.log("in try block")
//       const { Location } = await s3.upload(params).promise();
//       console.log('File uploaded successfully:', Location);
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [uploadingTestId]: file.name }));
//       await updateTestResultUrl(uploadingTestId, uploadingCustomerId, Location);
//       setFile(null);
//       setUploadingTestId(null);
//       setUploadingCustomerId(null);
//       fetchTests();
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateTestResultUrl = async (testId, customerId, url) => {
//     try {
//       setLoading(true);
//       await axios.post(`http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/updateTestResult`, {
//         testId,
//         customerId,
//         url,
//       });
//       console.log('Test result URL updated successfully.');
//     } catch (error) {
//       console.error('Error updating test result URL:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     { field: "id", headerName: "ID" },
//     { field: "testId", headerName: "Test ID" },
//     { field: "customerId", headerName: "Customer ID", flex: 1 },
//     { field: "test", headerName: "Test", flex: 1 },
//     { field: "animal", headerName: "Animal", flex: 1 },
//     {
//       field: "payment",
//       headerName: "Payment",
//       flex: 1,
//       renderCell: (cellParams) => <Switch checked={cellParams.value === "Paid"} />, 
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
//           onClick={() => handleUploadClick(cellParams.row.testId, cellParams.row.customerId)}
//         >
//           {cellParams.value ? "View" : "Upload"}
//         </Button>
//         // <>
//         //   {fileNames[cellParams.row.id] ? (
//         //     <Typography variant="body2" color={colors.primary[500]}>
//         //       {fileNames[cellParams.row.id]}
//         //     </Typography>
//         //   ) : (
//         //     <Button
//         //       variant="contained"
//         //       startIcon={<UploadIcon />}
//         //       sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }}
//         //       onClick={() => handleUploadClick(cellParams.row.testId, cellParams.row.customerId)}
//         //     >
//         //       {cellParams.value ? "View" : "Upload"}
//         //     </Button>
//         //   )}
//         // </>
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
//         {loading && <Loading/>}
//         <DataGrid
//           rows={tests}
//           columns={columns}
//           getRowId={(row) => row.id}
//         />
//       </Box>
//       <input
//         type="file"
//         id="fileInput"
//         style={{ display: 'none' }}
//         onChange={handleFileChange}
//       />
//     </Box>
//   );
// };

// export default Team;