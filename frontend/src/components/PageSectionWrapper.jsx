import React from "react";
import { Box } from "@mui/material";

const PageSectionWrapper = ({ children, sx = {} }) => (
  <Box
    sx={{
      flex: 1,
      m: 0,
      p: 0,
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default PageSectionWrapper;
