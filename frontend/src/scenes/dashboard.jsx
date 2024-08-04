import { Box, Button, Typography, useTheme, IconButton } from "@mui/material"; // Import IconButton
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../Components/Header";
import { tokens } from "../theme"; // Adjusted path
import { mockTransactions } from "../data/mockData"; // Adjusted path

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const maroonColor = "#800000";

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
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
          <EmailIcon sx={{ color: maroonColor, fontSize: "26px" }} />
          <Typography variant="h4" fontWeight="bold">
            537
          </Typography>
          <Typography variant="h6">Tests performed</Typography>
          <Typography variant="h5" fontStyle="italic">
            +5%
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
          <PointOfSaleIcon sx={{ color: maroonColor, fontSize: "26px" }} />
          <Typography variant="h4" fontWeight="bold">
            56700
          </Typography>
          <Typography variant="h6">Tests Amount</Typography>
          <Typography variant="h5" fontStyle="italic">
            +21%
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
          <PersonAddIcon sx={{ color: maroonColor, fontSize: "26px" }} />
          <Typography variant="h4" fontWeight="bold">
            45
          </Typography>
          <Typography variant="h6">New Customers</Typography>
          <Typography variant="h5" fontStyle="italic">
            +5%
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
          <TrafficIcon sx={{ color: maroonColor, fontSize: "26px" }} />
          <Typography variant="h4" fontWeight="bold">
            34
          </Typography>
          <Typography variant="h6">Appointments</Typography>
          <Typography variant="h5" fontStyle="italic">
            +4%
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
              <Typography variant="h5" fontWeight="600">
                Revenue Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                103400
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: maroonColor }}
                />
              </IconButton>
            </Box>
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
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
              color={maroonColor}
            >
              <Box>
                <Typography variant="h5" fontWeight="600">
                  {transaction.txId}
                </Typography>
                <Typography>{transaction.user}</Typography>
              </Box>
              <Box>{transaction.date}</Box>
              <Box
                backgroundColor={maroonColor} // Change background color to maroon
                color="#FFFFFF" // Change text color to white
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
