/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import {
  ThemeModeContext,
  // getColorTokens,
} from "../../theme/theme.js";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import Person4OutlinedIcon from "@mui/icons-material/Person4Outlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationPanel from "./Notification/NotificationPanel.jsx";
import UserSettingsPanel from "./Settings/UserSettingsPanel.jsx";
import UserProfilePanel from "./User profile/UserProfilePanel.jsx";
const TopBar = () => {
  const theme = useTheme();
  // const colors = getColorTokens(theme.palette.mode);
  const colorMode = useContext(ThemeModeContext);

  const [isSettingOpen, setSettingOpen] = useState(false);

  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(false);
  const profileHandler = (e) => setAnchorEl(anchorEl ? null : e.currentTarget);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <Box
      top="12px"
      width="100%"
      position="relative"
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      sx={{
        padding: "16px",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box
        width="124px"
        position="absolute"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Tooltip
          arrow
          enterDelay="1000"
          title={theme.palette.mode === "dark" ? "light mode" : "dark mode"}
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip arrow enterDelay="1000" title="notification">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow enterDelay="1000" title="user">
          <IconButton onClick={profileHandler}>
            <Person4OutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Notifiaction panel */}
      {isNotificationOpen && (
        <Box position="relative" top="200px" right="200px">
          <NotificationPanel />
        </Box>
      )}
      {/* Setting panel */}
      {isSettingOpen && (
        <Box>
          <UserSettingsPanel />
        </Box>
      )}

      {/* User profile panel */}
      {anchorEl && (
        <UserProfilePanel
          id={id}
          handleClick={profileHandler}
          open={open}
          pop={anchorEl}
        />
      )}
    </Box>
  );
};

export default TopBar;
