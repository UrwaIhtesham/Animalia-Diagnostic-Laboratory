import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Ensure path is correct
import axios from "axios";
import Header from "./comps/Header";
import { useState, useEffect } from "react";

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
  const [error, setError] = useState(""); // Added state for error handling

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/doctors");
      setDoctors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/doctors", newDoctor);
      fetchDoctors();
      setNewDoctor({
        doctorId: "",
        name: "",
        specialization: "",
        fees: "",
        time: "",
        day: ""
      });
      setError(""); // Clear error on successful addition
    } catch (error) {
      console.error("Error adding doctor:", error);
      setError("Failed to add doctor. Please try again.");
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

  const darkestMaroonColor = "#400000"; // Darkest shade of maroon

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
        }, 
      }}>
        <DataGrid rows={doctors} columns={columns} getRowId={(row) => row.doctorId} />
      </Box>
      {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
      <Box component="form" onSubmit={handleAddDoctor} mt="20px">
        <Typography variant="h6">Add New Doctor</Typography>
        <TextField
          name="doctorId"
          label="Doctor ID"
          value={newDoctor.doctorId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="name"
          label="Name"
          value={newDoctor.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="specialization"
          label="Specialization"
          value={newDoctor.specialization}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="fees"
          label="Fees"
          value={newDoctor.fees}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="time"
          label="Time"
          value={newDoctor.time}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="day"
          label="Day"
          value={newDoctor.day}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: darkestMaroonColor, color: "#FFFFFF" }}
        >
          Add Doctor
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDoctorsPage;
