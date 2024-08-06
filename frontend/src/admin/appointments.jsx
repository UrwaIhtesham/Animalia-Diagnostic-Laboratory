import React, {useState, useEffect} from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "./comps/Header"; // Updated import path
import { tokens } from "../theme"; // Updated import path
import axios from "axios";
import Loading from "../Components/Loading/Loading";

const Appointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(false);

  // Add a unique id property to each row in the mockDataAppointments
  const[appointments,setAppointments]=useState([])

  const columns = [
    { field: "id", headerName: "Customer ID" },
    { field: "email", headerName: "Doctor Name", flex: 1 },
    { field: "doctorid", headerName: "Doctor ID" },
    {field: "doctorname", headerName: "Doctor Name", flex:1},
    { field: "timing", headerName: "Time", flex: 1 },
    { field: "day", headerName: "Day", flex: 1 },
    { field: "fee", headerName: "Payment", flex: 1 },
  ];

  useEffect(() => {
    const token=localStorage.getItem('token');
    setLoading(true);
    axios.get('http://127.0.0.1:5000/getappointments',{
      headers:{
        'Authorization' : `Bearer ${token}`
      }
    })
        .then(response => {
            console.log('Response headers:', response.data);  // Debug print
            setAppointments(response.data);
            
            //setDoctors(response.data);
        })
        .catch(error => {
            console.log('There was an error fetching the Appointments!', error);
            if (error.response) {
                console.log('Error response data:', error.response.data);  // Debug print
                console.log('Error response status:', error.response.status);  // Debug print
                console.log('Error response headers:', error.response.headers);  // Debug print
            }
        }) .finally(()=> {
          setLoading(false);
        });
    
  }, []);


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
        {loading && <Loading/>}
        <DataGrid rows={appointments} columns={columns} components={{Toolbar: GridToolbar}} pageSize={10} />
      </Box>
    </Box>
  );
};

export default Appointments;
