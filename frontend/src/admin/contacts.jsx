import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Updated import path

import Header from "../admin/comps/Header"; // Updated import path
import { useTheme } from "@mui/material";
import axios from 'axios';
import Loading from '../Components/Loading/Loading';

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setusers] = useState([]);

  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "id", headerName: "Customer ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    // { field: "phone", headerName: "Phone Number", flex: 1 },
    // { field: "id", headerName: "Test ID", flex: 0.5 }, // Changed column name
  ];
  useEffect(() => {
    const token=localStorage.getItem('token');
    setLoading(true);
    axios.get('http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/users',{
      headers:{
        'Authorization' : `Bearer ${token}`
      }
    })
        .then(response => {
            console.log('Response headers:', response.data);  // Debug print
            setusers(response.data);
            console.log("Users list",users);
            //setDoctors(response.data);
        })
        .catch(error => {
            alert('There was an error fetching the customers!', error);
            if (error.response) {
                console.log('Error response data:', error.response.data);  // Debug print
                console.log('Error response status:', error.response.status);  // Debug print
                console.log('Error response headers:', error.response.headers);  // Debug print
            }
        }) .finally (()=> {
          setLoading(false);
        });
    
  }, []);
  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-row": {
            '&:nth-of-type(even)': {
              backgroundColor: colors.primary[100], // Ensuring alternate row color is not blue
            },
            '&:nth-of-type(odd)': {
              backgroundColor: colors.primary[200], // Ensuring alternate row color is not blue
            },
          },
        }}
      >
        {loading && <Loading/>}
        <DataGrid

          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          sortModel={[{ field: 'id', sort: 'asc' }]}
        />
      </Box>
    </Box>
  );
};

export default Contacts;