import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";

const AdminDoctorsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    doctorId: "",
    name: "",
    specialization: "",
    fees: "",
    time: "",
    day: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/doctors", newDoctor);
      fetchDoctors();
      setNewDoctor({
        doctorId: "",
        name: "",
        specialization: "",
        fees: "",
        time: "",
        day: ""
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const columns = [
    { field: "doctorId", headerName: "Doctor ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "specialization", headerName: "Specialization", flex: 1 },
    { field: "fees", headerName: "Fees", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "day", headerName: "Day", flex: 1 }
  ];

  return (
    <Box m="20px">
      <Header title="Doctors" subtitle="Manage doctors" />
      <Box m="40px 0 0 0" height="75vh" sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none", color: colors.primary[500] },
        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.primary[800], borderBottom: "none" },
        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[800] },
        "& .MuiDataGrid-row": {
          '&:nth-of-type(even)': { backgroundColor: colors.primary[100] },
          '&:nth-of-type(odd)': { backgroundColor: colors.primary[200] },
          '& .MuiDataGrid-cell': { color: colors.primary[500] },
        },
      }}>
        <DataGrid rows={doctors} columns={columns} getRowId={(row) => row.doctorId} />
      </Box>

      <Box component="form" onSubmit={handleAddDoctor} mt="20px">
        <Typography variant="h6">Add New Doctor</Typography>
        <TextField name="doctorId" label="Doctor ID" value={newDoctor.doctorId} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField name="name" label="Name" value={newDoctor.name} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField name="specialization" label="Specialization" value={newDoctor.specialization} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField name="fees" label="Fees" value={newDoctor.fees} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField name="time" label="Time" value={newDoctor.time} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField name="day" label="Day" value={newDoctor.day} onChange={handleInputChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Add Doctor</Button>
      </Box>
    </Box>
  );
};

export default AdminDoctorsPage
