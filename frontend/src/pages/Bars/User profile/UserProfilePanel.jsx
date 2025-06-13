/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import Unavailable from "../../../components/Unavailable";
import {
  Box,
  Button,
  IconButton,
  Popper,
  Typography,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { UserContext } from "../../UserContext/UserContext";
import { logoutTeacher } from "../../../services/teacher";
import { getColorTokens } from "../../../theme/theme";
import { useNavigate } from "react-router-dom";
import UpdateUser from "../../UpdateUser/UpdateUser";
const UserProfile = ({ id, open, pop }) => {
  const colors = getColorTokens(useTheme().palette.mode);
  const navigate = useNavigate();
  // const { user, updateUser, clearUser } = useContext(UserContext);
  const logoutHandler = async () => {
    const response = await logoutTeacher();
    if (response.status == "200") {
      navigate("/login");
    }
    console.log("response from logout ", response);
  };

  const [isUpdatePageOpen, setUpdatePageOpen] = useState(false);
  return (
    <Box>
      <Popper
        id={id}
        open={open}
        anchorEl={pop}
        sx={{
          p: 1,
          borderRadius: "4px",
          border: "",
          background: colors.gradient[100],
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <IconButton onClick={() => setUpdatePageOpen(true)}>
            <SettingsOutlinedIcon />
            <Typography
              variant="h6"
              sx={{
                px: 1,
              }}
            >
              Setting
            </Typography>
          </IconButton>
          <IconButton onClick={logoutHandler}>
            <LogoutIcon />
            <Typography
              variant="h6"
              sx={{
                px: 1,
              }}
            >
              {" "}
              Logout
            </Typography>
          </IconButton>
        </Box>
      </Popper>
      {isUpdatePageOpen && (
        <Box>
          <UpdateUser  />
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
