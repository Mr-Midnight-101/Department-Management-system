/* eslint-disable no-unused-vars */
import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { getColorTokens } from "../theme/theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "4px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.grey[100]} sx={{ m: "4px", p:"2px" }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
