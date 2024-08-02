import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Ensure path is correct
import axios from "axios";
import Header from "./comps/Header";
import { useState, useEffect } from "react"; // Import useState and useEffect

const OurTests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tests, setTests] = useState([]);
  const [newTests, setNewTests] = useState({
    name: "",
    testfees: "",
    animal: ""
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/alltests"); // Fixed endpoint to fetch tests
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTests({ ...newTests, [name]: value });
  };

  const handleAddTests = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/addtest", newTests); // Fixed endpoint to add tests
      fetchTests();
      setNewTests({
        name: "",
        testfees: "",
        animal: ""
      });
    } catch (error) {
      console.error("Error adding tests:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Test ID", width: 150 },
    { field: "name", headerName: "Name", flex: 1 },
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
        <TextField
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
        />
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#400000", color: "#FFFFFF" }}>
          Add Test
        </Button>
      </Box>
    </Box>
  );
};

export default OurTests;
