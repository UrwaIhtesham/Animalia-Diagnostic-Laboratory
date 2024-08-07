import { 
  Box, Button, TextField, 
  Typography, useTheme, FormControl,
  InputLabel, Select, OutlinedInput,
  MenuItem, Chip, FormLabel, FormGroup,
Checkbox, ListItemText } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Ensure path is correct
import axios from "axios";
import Header from "./comps/Header";
import { useState, useEffect } from "react"; // Import useState and useEffect
import Loading from "../Components/Loading/Loading";

const OurTests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tests, setTests] = useState([]);

  const [loading, setLoading] = useState(false);

  const [newTests, setNewTests] = useState({
    name: "",
    testfees: "",
    animal: []
  });

  const [selectedAnimals, setSelectedAnimals] = useState([]);

  const Animals = [
    'cow',
    'dog',
    'buffalo',
    'goat',
    'sheep',
    'cat',
    'parrot',
    'chicken'
  ];

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        width: 250,
      },
    },
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/alltests", {
        headers:{
          'Authorization' : `Bearer ${token}`
        }
      }); // Fixed endpoint to fetch tests
      console.log(response.data);
      // Map the data to match the columns
      const mappedTests = response.data.map((test) => ({
        id: test["test id"], // Use 'id' as the unique identifier for DataGrid
        name: test["test name"],
        testfees: test["Fee"],
        animal: test["animal"]
      }));
      
      // Ensure IDs are unique
      const uniqueIds = new Set(mappedTests.map(test => test.id));
      if (uniqueIds.size !== mappedTests.length) {
        console.error("Duplicate IDs found:", mappedTests);
      }

      setTests(mappedTests); // Set mappedTests to the state
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTests({ ...newTests, [name]: value });
  };

  const handleAddTests = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const animalString = newTests.animal.join(', ');
      const response = await axios.post("http://localhost:5000/addtest", {
        name: newTests.name,
        testfees: newTests.testfees,
        animal: animalString,
      }, {headers:{
        'Authorization' : `Bearer ${token}`
      }
      });  // Fixed endpoint to add tests
      console.log(response);
      fetchTests();
      setNewTests({
        name: "",
        testfees: "",
        animal: []
      });
    } catch (error) {
      console.error("Error adding tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimalSelection = (animal) => {
    setNewTests(prev => {
      const updatedAnimals = prev.animal.includes(animal)
        ? prev.animal.filter(a => a !== animal)
        : [...prev.animal, animal];
      return { ...prev, animal: updatedAnimals };
    });
  };

  const columns = [
    { field: "id", headerName: "Test ID", width: 150 },
    { field: "name", headerName: "Name", flex: 4 },
    { field: "testfees", headerName: "Fees", flex: 1 },
    { field: "animal", headerName: "Animal", flex: 1 }
  ];

  const maroonColor = "#800000"; // Define maroon color

  return (
    <Box m="20px">
      <Header title="Our Tests" subtitle="Manage Tests" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none", color: colors.primary[500] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.primary[800], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[800] },
          "& .MuiDataGrid-row": {
            '&:nth-of-type(even)': { backgroundColor: colors.primary[100] },
            '&:nth-of-type(odd)': { backgroundColor: colors.primary[200] },
          },
        }}
      >
        {loading && <Loading/>}
        <DataGrid rows={tests} columns={columns} getRowId={(row) => row.id} />
      </Box>

      <Box component="form" onSubmit={handleAddTests} mt="20px">
        <Typography variant="h6">Add New Test</Typography>
        <TextField
          name="name"
          label="Name"
          value={newTests.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { backgroundColor: "white", color: maroonColor } // Set background and text color
          }}
          InputLabelProps={{
            style: { color: maroonColor } // Set label color
          }}
        />
        <TextField
          name="testfees"
          label="Fees"
          value={newTests.testfees}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { backgroundColor: "white", color: maroonColor } // Set background and text color
          }}
          InputLabelProps={{
            style: { color: maroonColor } // Set label color
          }}
        />
        {/* <TextField
          name="animal"
          label="Animal"
          value={newTests.animal}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { backgroundColor: "white", color: maroonColor } // Set background and text color
          }}
          InputLabelProps={{
            style: { color: maroonColor } // Set label color
          }}
        /> */}
        <FormControl component="fieldset" fullWidth margin="normal">
          <FormLabel component="legend">Animal</FormLabel>
          <FormGroup row>
            {Animals.map((animal) => (
              <Button
                key={animal}
                variant={selectedAnimals.includes(animal) ? 'contained' : 'outlined'}
                onClick={() => handleAnimalSelection(animal)}
                sx={{
                  marginRight: 2,
                  backgroundColor: selectedAnimals.includes(animal) ? 'gray' : 'white',
                  color: selectedAnimals.includes(animal) ? 'white' : maroonColor,
                  fontSize: '10px',
                  fontWeight: '900',
                  '&:hover': {
                    backgroundColor: selectedAnimals.includes(animal) ? 'darkgray' : 'white',
                    color: selectedAnimals.includes(animal) ? 'white' : 'lightgrey',
                  },
                }}
                className='but'
              >
                {animal}
              </Button>
            ))}
          </FormGroup>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#400000", color: "#FFFFFF", margin: "0.5rem 0" }} disabled={loading}>
          {loading ? "Adding..." : "Add Test"}
        </Button>
      </Box>
    </Box>
  );
};

export default OurTests;
