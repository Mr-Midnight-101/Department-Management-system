/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined"; //students
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined"; //course
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined"; //subjects
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined"; //teacher
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined"; //attendance
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined"; //dashboard
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined"; //barchart
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined"; //pie
import StackedLineChartOutlinedIcon from "@mui/icons-material/StackedLineChartOutlined"; //line
import { getColorTokens } from "../../theme/theme.js";
import "react-pro-sidebar/dist/css/styles.css";

const SidebarItem = ({ title, to, icon, selected, setSelected, color }) => {
  return (
    <MenuItem
      style={{ color }}
      icon={icon}
      active={selected === title}
      onClick={() => setSelected(title)}
    >
      <Typography sx={{ fontWeight: "500" }}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Bar = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      height="100%"
      sx={{
        margin: "0",
        "& .pro-sidebar-rootStyles": {
          width: "100% !important",
        },
        "& .pro-sidebar-inner": {
          borderRadius: " 0 4px 4px 0",

          background: `${colors.black[500]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 24px 5px 20px !important",
          "&:hover": { color: `${colors.grey[600]} !important` },
        },
        "& .pro-menu-item.active": {
          color: `${colors.red[500]} !important `,
        },
        "& .pro-menu-item.active, & .pro-menu-item.active-item": {
          color: `${colors.red[500]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape="square">
          <MenuItem
            icon={collapsed ? <MenuOutlinedIcon /> : <MenuOpenOutlinedIcon />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: "10px",
              margin: " 0 10px 10px 0 ",
            }}
          />

          <Box>
            <SidebarItem
              title="Dashboard"
              to="/"
              icon={<WidgetsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              sx={{
                padding: "12px 22px",
                fontWeight: "bold",
              }}
            >
              Data
            </Typography>
            <SidebarItem
              title="Student"
              to="/student"
              icon={<SchoolOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SidebarItem
              title="Course"
              to="/course"
              icon={<LibraryBooksOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SidebarItem
              title="Subject"
              to="/subject"
              icon={<CategoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SidebarItem
              title="Teacher"
              to="/teacher"
              icon={<SupervisorAccountOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              color={colors.white[100]}
            />
            <SidebarItem
              title="Attendance"
              to="/attendance"
              icon={<HowToRegOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              sx={{
                padding: "12px 22px",
                fontWeight: "bold",
              }}
            >
              Chart
            </Typography>
            <SidebarItem
              title="Bar"
              to="/barchart"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SidebarItem
              title="Pie"
              to="/piechart"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SidebarItem
              title="Line"
              to="/linechart"
              icon={<StackedLineChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Bar;
