/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import {
  ThemeModeContext,
  getColorTokens,
  useThemeMode,
} from "../../theme/theme.js";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Person4OutlinedIcon from "@mui/icons-material/Person4Outlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
const TopBar = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  const colorMode = useContext(ThemeModeContext);
  //xs : 600
  //sm : 600
  //md : 600
  //lg : 600
  //xl : 600

  return (
    <Box
      maxWidth="xl"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      sx={{
        // backgroundColor: colors.grey[100],
        flexDirection: {
          xs: "column-reverse", // Stack on small screens
          sm: "row", // Side by side on tablets and up
        },
        alignItems: {
          xs: "flex-end",
        },
        m: 2,
        mr: {
          xs: 12,
          md: 12,
          lg: 12,
          xl: 0,
        },
      }}
    >
      <Box
        display="flex"
        flexGrow
        gap={2}
        sx={{
          background: colors.grey[800],

          width: {
            xs: "100%", // Full width on small screens
            sm: "auto", // Half on larger screens
            // Half on larger screens
          },
        }}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchOutlinedIcon />
        </IconButton>
      </Box>
      {/* Icons */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="3px"
        color={colors.grey[500]}
        sx={{
          // background: colors.grey[800],
          mr: 2,
          width: {
            xs: "40%", // Full width on small screens
            sm: "auto", // Half on larger screens
          },
        }}
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <Person4OutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;
