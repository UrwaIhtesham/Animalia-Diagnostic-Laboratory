import { Box, Button, Typography, useTheme, IconButton } from "@mui/material"; // Import IconButton
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "./comps/Header";
import { tokens } from "../theme"; // Adjusted path
import { mockTransactions } from "./data/mockData";
import Loading from "../Components/Loading/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import BiotechIcon from '@mui/icons-material/Biotech';
import MedicationIcon from '@mui/icons-material/Medication';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(false);

  const maroonColor = "#800000";

  const [insights, setInsights] = useState({
    users: 0,
    tests: 0,
    booked_tests: 0,
    appointments:0,
    previous: {
      users: 0,
      tests: 0,
      booked_tests: 0,
      appointments: 0,
    }
  });
  const [revenue, setRevenue] = useState(0);
  const [testcount, setTestCount] = useState(0);
  const [appointcount, setAppointCount] = useState(0);

  const [invoice, setInvoice]=useState([]);
  const [user, setUsers] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      const token=localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/insights', {
          headers: {
            Authorization: `Bearer ${token}` // Replace with actual token
          }
        });
        setInsights(response.data);
        console.log(response.data);

        const revenueResponse = await axios.get('http://localhost:5000/revenue', {
          headers: {
            Authorization: `Bearer ${token}` // Replace with actual token
          }
        });
        setRevenue(revenueResponse.data.revenue.total);
        setTestCount(revenueResponse.data.revenue.tests_count);
        setAppointCount(revenueResponse.data.revenue.appoint_count);
        console.log(revenueResponse);

        const invoice = await axios.get('http://localhost:5000/bookedlabtests', {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setInvoice(invoice.data);
        console.log(invoice);

        const users_data = await axios.get('http://localhost:5000/users', {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(users_data.data);
        console.log(user);

        setLoading(true);
      } catch (error) {
        console.error("Error fetching insights data:", error);
        setLoading(false);
      } finally{
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  };

  // Destructure current and previous values
  const { users, tests, booked_tests, appointments, previous } = insights;
  const previousValues = previous || {users: 0, tests: 0, booked_tests: 0, appointments: 0 };

  const userChange = calculatePercentageChange(users, previousValues.users);
  const testsChange = calculatePercentageChange(tests, previousValues.tests);
  const bookedTestsChange = calculatePercentageChange(booked_tests, previousValues.booked_tests);
  const appointmentsChange = calculatePercentageChange(appointments, previousValues.appointments);

  const getCustomerEmail = (customerId) => {
    const us = user.find(use => use.id === customerId);
    return us ? us.email : 'Unknown';
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center"
      sx={{'& .MuiTypography-h5': {
        color:colors.primary[200],
        textDecoration: 'underline'
      }}}>
      {loading && <Loading/>}
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 2fr)"
        gridAutoRows="150px"
        gap="25px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor="#FFFFFF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          color={maroonColor}
        >
          <EmailIcon sx={{ color: maroonColor, fontSize: "30px" }} />
          <Typography variant="h3" fontWeight="bold">
            {insights.tests}
          </Typography>
          <Typography variant="h5" fontWeight='700'>Tests performed</Typography>
          <Typography variant="h5" fontStyle="italic" fontWeight='500'>
          {userChange >= 0 ? '+' : ''}{userChange.toFixed(2)}%
          </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="#FFFFFF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          color={maroonColor}
        >
          <BiotechIcon sx={{ color: maroonColor, fontSize: "30px" }} />
          <Typography variant="h3" fontWeight="bold">
            {insights.booked_tests || 'N/A'} 
          </Typography>
          <Typography variant="h5" fontWeight='700'>Tests Amount</Typography>
          <Typography variant="h5" fontStyle="italic" fontWeight='500'>
          {testsChange >= 0 ? '+' : ''}{testsChange.toFixed(2)}%
          </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="#FFFFFF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          color={maroonColor}
        >
          <PersonAddIcon sx={{ color: maroonColor, fontSize: "30px" }} />
          <Typography variant="h3" fontWeight="bold">
          {insights.users}
          </Typography>
          <Typography variant="h5" fontWeight='700'>Customers</Typography>
          <Typography variant="h5" fontStyle="italic" fontWeight='500'>
          {bookedTestsChange >= 0 ? '+' : ''}{bookedTestsChange.toFixed(2)}%
          </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="#FFFFFF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          color={maroonColor}
        >
          <MedicationIcon sx={{ color: maroonColor, fontSize: "30px" }} />
          <Typography variant="h3" fontWeight="bold">
          {insights.appointments}
          </Typography>
          <Typography variant="h5" fontWeight='700'>Appointments Booked</Typography>
          <Typography variant="h5" fontStyle="italic" fontWeight='500'>
          {appointmentsChange >= 0 ? '+' : ''}{appointmentsChange.toFixed(2)}%
          </Typography>
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#FFFFFF" // Change to white background
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color={maroonColor}>
              <Typography variant="h3" fontWeight="600">
                Revenue Generated
              </Typography>
              <Typography variant="h1" fontWeight="bold" mb={6}>
              {revenue?revenue.toLocaleString():'Loading...'}
              </Typography> 
                  <Typography variant="h4" mb={6} fontWeight="600" display="inline">
                        Revenue Generated from Lab Tests Booking:
                  </Typography>
                  
                  <Typography variant="h3" display="inline" ml={6} fontWeight="700" mb={5}> {/* Add margin-left to create space */}
                      {testcount}
                  </Typography>
                  <Typography></Typography>
              <Typography variant="h4" fontWeight="600" display='inline'>
              Revenue Generated from Doctor Appointments: 
              </Typography>
              <Typography variant="h3" display="inline" ml={2} fontWeight="700" mb={5}> {/* Add margin-left to create space */}
                      {appointcount}
                  </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: maroonColor }}
                />
              </IconButton>
            </Box> */}
          </Box>
          {/* <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box> */}
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#FFFFFF" // Change to white background
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
            color={maroonColor}
          >
            <Typography variant="h5" fontWeight="600">
              Recent Invoices
            </Typography>
          </Box>
          {invoice.map((invoice, i) => (
            <Box
              key={`${invoice['book test id']}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
              color={maroonColor}
            >
              <Box>
                <Typography variant="h5" fontWeight="600">
                {`Customer ID: ${invoice['customer id']}`}
                </Typography>
                <Typography>{getCustomerEmail(invoice['customer id'])}</Typography>
              </Box>
              <Box>{invoice.date}</Box>
              <Box
                backgroundColor={maroonColor} // Change background color to maroon
                color="#FFFFFF" // Change text color to white
                p="5px 10px"
                borderRadius="4px"
              >
                Rs. {invoice.fees}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
