import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Ensure path is correct
import axios from "axios";
import Header from "../Components/Header";
import { useState, useEffect } from "react";

const AdminDoctorsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    fees: "",
    experience: "",
    timing: ""
  });
  const [error, setError] = useState(""); // Added state for error handling

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get('http://127.0.0.1:5000/doctors', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Response headers:', response.data);  // Debug print
      setDoctors(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the doctors!', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);  // Debug print
        console.log('Error response status:', error.response.status);  // Debug print
        console.log('Error response headers:', error.response.headers);  // Debug print
      }
    });
    
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fees" || name ==="experience") {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        setNewDoctor({ ...newDoctor, [name]: intValue });
      }
    } else {
      setNewDoctor({ ...newDoctor, [name]: value });
    }
  };

  const handleAddDoctor = async (event) => {
    event.preventDefault();
    console.log("In add doctor");
    console.log(newDoctor.fees);
    try{
      await axios.post("http://localhost:5000/adddoctors", newDoctor)
      console.log("Successful")
      setNewDoctor({
            
            name: "",
            specialization: "",
            fees: "",
            experience: "",
            timing: ""
          });
    } catch(error) {
      console.log("Error", error)
    }
    // try {
    //   await axios.post("http://localhost:5000/api/doctors", newDoctor);
    //   fetchDoctors();
    //   setNewDoctor({
    //     doctorId: "",
    //     name: "",
    //     specialization: "",
    //     fees: "",
    //     time: "",
    //     day: ""
    //   });
    //   setError(""); // Clear error on successful addition
    // } catch (error) {
    //   console.error("Error adding doctor:", error);
    //   setError("Failed to add doctor. Please try again.");
    // }
  };

  const columns = [
    { field: "id", headerName: "Doctor ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "specialization", headerName: "Specialization", flex: 1 },
    { field: "fees", headerName: "Fees", flex: 1 },
    { field: "experience", headerName: "Experience", flex: 1 },
    { field: "timing", headerName: "Timing", flex: 1 }
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
        <DataGrid rows={doctors} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
      {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
      <Box component="form" mt="20px" onSubmit={handleAddDoctor}>
        <Typography variant="h6">Add New Doctor</Typography>
        {/* <TextField
          name="doctorId"
          label="Doctor ID"
          value={newDoctor.doctorId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        /> */}
        <TextField
          name="name"
          label="Name"
          value={newDoctor.name}
          required={true}
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
          required={true}
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
          required={true}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="experience"
          label="Experience"
          value={newDoctor.experience}
          required={true}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ style: { backgroundColor: "#FFFFFF", color: "#000000" } }} // Background white, text black
          InputLabelProps={{ style: { color: "#800000" } }} // Label color maroon
        />
        <TextField
          name="timing"
          label="Timing"
          value={newDoctor.timing}
          required={true}
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
