import React from 'react';
import { 
  Box, 
  FormGroup,
  FormLabel,
  Button, 
  TextField, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  OutlinedInput,
  Chip,
  Checkbox,
  IconButton,
  ListItemText } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Header from "./comps/Header";
import { useState, useEffect } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tokens } from "../theme";
import { useTheme } from '@mui/material/styles';
import Loading from '../Components/Loading/Loading';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './AdminDoctorsPage';

const daysofWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING,
      width: 250,
    },
  },
};

const AdminDoctorsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setloading]= useState(false);

  const [name, setName] = useState("");
  const[specialization, setSpecialization] = useState("");
  const [fee, setfee]= useState("");
  const [days, setDays] = useState([]);
  const [experience, setExperience] = useState("");
  // const [fromTime, setFromTime] = useState(new Date());
  // const [toTime, setToTime] = useState(new Date());

  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);

  const handleFromTimeChange = (time) => {
    setFromTime(time);
  };

  const handleToTimeChange = (time) => {
    setToTime(time);
  };

  const formatTimeRange = () => {
    if (fromTime && toTime) {
      const format = (time) => time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${format(fromTime)} - ${format(toTime)}`;
    }
    return '';
  };

  // const handleSave = () => {
  //   const timeRangeString = formatTimeRange();
  //   axios.post('/api/doctors', { timeRange: timeRangeString });
  // }

  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    doctorId: "",
    name: "",
    specialization: "",
    fees: "",
    time: "",
    day: ""
  });
  const [error, setError] = useState("");
  //const [dayOptions, setDayOptions] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      setloading(true);
      const response = await axios.get("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/doctors", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      const mappedDoctors = response.data.map(doctor => ({
        doctorId: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        fees: doctor.fees,
        experience: doctor.experience,
        time: doctor.timing,
        day: doctor.days
      }));
      setDoctors(mappedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors. Please try again later.");
    } finally{
      setloading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleDayChange = (event) => {
    // setNewDoctor({ ...newDoctor, day: e.target.value });
    const {
      target: {value},
    } = event;
    setDays(typeof value === "string" ? value.split(","): value);
  };

  const handleSelection = (value) => {
    setSpecialization(value);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    const formattedDays = days.join(", ");
    const formattedTime = `${fromTime.toTimeString(). split(" ")[0]} - ${toTime.toTimeString().split(" ")[0]}`;
    //const timeRangeString = formatTimeRange();
    try {
      setloading(true);
      console.log(specialization);
      const token = localStorage.getItem('token');
      const response = await axios.post("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/adddoctors", {
        name, specialization, 
        fee, experience,
        days: formattedDays,
        time: formattedTime,
      }, {headers: {
        'Authorization': `Bearer ${token}`
      }
    });
      console.log(response);
      if (response.status === 200){
        console.log("Doctor Added Successfully");
        fetchDoctors();
        setName("");
      setSpecialization("");
      setfee("");
      setExperience("");
      setDays([]);
      setFromTime(null);
      setToTime(null);
      setError("");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      setError("Failed to add doctor. Please try again.");
    } finally{
      setloading(false);
    }

  };

  const handleIncrement = () => {
    setExperience(prev => (typeof prev === 'string' ? parseInt(prev) + 1 : prev + 1).toString());
  };

  const handleDecrement = () => {
    setExperience(prev => (parseInt(prev) > 0 ? parseInt(prev) - 1 : 0));
  };

  const columns = [
    { field: "doctorId", headerName: "Doctor ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 2},
    { field: "specialization", headerName: "Specialization", flex: 1 },
    { field: "fees", headerName: "Fees", flex: 1 },
    { field: "experience", headerName: "Experience (years)", flex:1},
    { field: "time", headerName: "Time", flex: 2 },
    { field: "day", headerName: "Day", flex: 2 }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m="20px">
        <Header title="Doctors" subtitle="Manage doctors" />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5", borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: "#e0e0e0" },
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: "#f5f5f5" },
            "& .MuiDataGrid-row": {
              '&:nth-of-type(even)': { backgroundColor: colors.primary[300] },
              '&:nth-of-type(odd)': { backgroundColor: colors.primary[400] },
            },
            "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[800],
          },
          "& css-1gywbfv-MuiButtonBase-root-MuiButton-root":{
            backgroundColor: specialization ? 'gray !important' : 'white',
            color: specialization ? 'white' : colors.primary[800],
          },
          }}
        >
          {loading && <Loading/>}
          <DataGrid
            rows={doctors}
            columns={columns}
            getRowId={(row) => row.doctorId}
          />
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleAddDoctor} mt="20px">
          <Typography variant="h6">Add New Doctor</Typography>
          <TextField
            name="name"
            label="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            fullWidth
            margin="normal"
          />
      <FormControl component="fieldset" fullWidth margin="normal">
        <FormLabel component="legend">Specialization</FormLabel>
        <FormGroup row>
          <Button
            variant={specialization === 'Pet' ? 'contained' : 'outlined'}
            onClick={() => handleSelection('Pet')}
            sx={{ marginRight: 2, backgroundColor: specialization === 'Pet' ? 'gray' : 'white', color: specialization === 'Pet' ? 'maroon' : 'maroon', fontSize:'10px', fontWeight:'900',
              '&:hover': {
          backgroundColor: specialization === 'Pet' ? 'darkred' : 'white',
          color: specialization === 'Pet' ? 'white' : 'lightgrey',
        }
            }}
            className='but'
          >
            Pet
          </Button>
          <Button
            variant={specialization === 'Poultry' ? 'contained' : 'outlined'}
            onClick={() => handleSelection('Poultry')}
            sx={{ marginRight: 2, backgroundColor: specialization === 'Poultry' ? 'gray' : 'white', color: specialization === 'Poultry' ? 'white' : 'maroon', fontSize:'10px', fontWeight:'900',
              '&:hover': {
                    backgroundColor: specialization === 'Poultry' ? 'darkgray' : 'white',
                    color: specialization === 'Poultry' ? 'white' : 'lightgrey',
                  },
             }}
            className='but'
          >
            Poultry
          </Button>
          <Button
            variant={specialization === 'Livestock' ? 'contained' : 'outlined'}
            onClick={() => handleSelection('Livestock')}
            sx={{ marginRight: 2, backgroundColor: specialization === 'Livestock' ? 'gray' : 'white', color: specialization === 'Livestock' ? 'maroon' : 'maroon', fontSize:'10px', fontWeight:'900',
              '&:hover': {
          backgroundColor: specialization === 'Livestock' ? 'darkgray' : 'white',
          color: specialization === 'Livestock' ? 'white' : 'lightgrey',
        },
             }}
            className='but'
          >
            Livestock
          </Button>
        </FormGroup>
      </FormControl>
      {specialization && (
        <Typography variant="body1" marginTop={2}>
          Selected Specialization: {specialization}
        </Typography>
      )}
          <TextField
            name="fees"
            label="Fees"
            value={fee}
            onChange={(e) => setfee(e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* <TextField
            name="experience"
            label="Experience"
            value={experience}
            onChange={(e)=> setExperience(e.target.value)}
            fullWidth
            margin="normal"
          /> */}
          <Box mt={2} display="flex" alignItems="center">
            <Typography>Experience (years): </Typography>
            <Box display="flex" alignItems="center" ml={1}>
              <IconButton size="small" onClick={handleDecrement}>
                <RemoveIcon />
              </IconButton>
              <TextField
                name="experience"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                margin="normal"
                style={{ width: "60px" }}
              />
              <IconButton size="small" onClick={handleIncrement}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          {/* <FormControl fullWidth margin="normal">
            <InputLabel id="day-label">Day</InputLabel>
            <Select
              labelId="day-label"
              name="day"
              value={newDoctor.day}
              onChange={handleDayChange}
              label="Day"
            >
              {dayOptions.map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
           <FormControl fullWidth margin="normal">
          <InputLabel>Days</InputLabel>
          <Select
            multiple
            value={days}
            onChange={handleDayChange}
            input={<OutlinedInput label="Days" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {daysofWeek.map((day) => (
              <MenuItem key={day} value={day}>
                <Checkbox checked={days.indexOf(day) > -1} />
                <ListItemText primary={day} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          <Box mt="16px">
            <TimePicker
              label="Time (from)"
              value={fromTime}
              onChange={handleFromTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          <Box mt="16px">
            <TimePicker
              label="Time (to)"
              value={toTime}
              onChange={handleToTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
            sx={{ margin: '1rem 0' }}
          >
            {loading ? "Adding..." : "Add Doctor"}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDoctorsPage;
