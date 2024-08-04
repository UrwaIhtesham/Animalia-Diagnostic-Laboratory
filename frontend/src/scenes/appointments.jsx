import React, {useState, useEffect} from "react";
import { Box,  useTheme } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { mockDataAppointments } from "../data/mockData"; // Updated import path
import Header from "../Components/Header"; // Updated import path
import { tokens } from "../theme"; // Updated import path
import axios from 'axios';


const Appointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Add a unique id property to each row in the mockDataAppointments
  const[appointments,setAppointments]=useState([])

  const columns = [
    { field: "id", headerName: "Appointment ID", flex: 1 },
    { field: "doctorid", headerName: "Doctor ID", flex: 1 },
    { field: "email", headerName: "User Email", flex: 1 },
    { field: "fee", headerName: "Fee", flex: 1 },
    { field: "timing", headerName: "Time", flex: 1 },
    { field: "day", headerName: "Day", flex: 1 },
  ];
  useEffect(() => {
    const token=localStorage.getItem('token');
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
        <DataGrid rows={appointments} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Appointments;
