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
      maxWidth="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      sx={{
        flex: 1,
        // backgroundColor: colors.grey[100],
        flexDirection: {
          xs: "column-reverse", // Stack on small screens
          sm: "row", // Side by side on tablets and up
        },
        alignItems: {
          xs: "flex-end",
        },
        m: "16px 0 40px 16px",
        mr: {
          xs: 12,
          md: 12,
          lg: 12,
          xl: 1,
        },
      }}
    >
      <Box
        display="flex"
        flexGrow
        gap={2}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.2)" /* 20% opaque white */,
          /* backdrop-filter will blur and desaturate the *actual gradient behind this element* */
          backdropFlter: "blur(8px)" /* Adjust blur strength as desired */,
          // -webkit-backdrop-filter: blur(8px); /* Safari support */

          /* Optional: Subtle border for "glass" effect */
          border: " 1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "4px" /* Soften corners */,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" /* Subtle shadow */,

          /* Ensure content inside is readable */
          color: colors.text[100],

          width: {
            xs: "100%", // Full width on small screens
            sm: "auto", // Half on larger screens
            // Half on larger screens
          },
        }}
        borderRadius="3px"
      >
        <InputBase
          sx={{ color: colors.text[100], ml: 2, flex: 1 }}
          placeholder="Search"
        />
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
          // background: colors.grey[100],
          mr: 0,
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
