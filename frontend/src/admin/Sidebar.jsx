import { useState } from "react";
import { tokens } from "../theme";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined"; // Icon for Appointments
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined"; // Icon for Doctors
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const maroon = "#800000"; // Define the maroon color directly

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: maroon,
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const maroon = "#800000"; // Define the maroon color directly
  const white = "#FFFFFF"; // Define the white color directly
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${white} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${maroon} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${maroon} !important`,
        },
        "& .MuiButtonBase-root": {
          color: `${maroon} !important`
        }
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: maroon,
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h4" color={maroon} fontWeight="bold" textAlign="center">
                  ANIMALIA DIAGNOSTIC <br /> CENTRE
                </Typography>
                <Typography variant="h5" color={maroon} textAlign="center">
                  ADMINISTRATION
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contact Information"
              to="/admin/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Appointments"
              to="/admin/appointments"
              icon={<EventNoteOutlinedIcon />} // Icon for Appointments
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Doctors"
              to="/admin/doctors"
              icon={<LocalHospitalOutlinedIcon />} // Icon for Doctors
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Our Tests"
              to="/admin/OurTests"
              icon={<VaccinesOutlinedIcon />} // Icon for Doctors
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tests Appointment"
              to="/admin/team"
              icon={<BookOnlineOutlinedIcon />} // Icon for Doctors
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
