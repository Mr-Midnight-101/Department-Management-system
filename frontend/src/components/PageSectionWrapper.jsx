import React from "react";
import { Box } from "@mui/material";

const PageSectionWrapper = ({ children, sx = {} }) => (
  <Box
    sx={{
      flex: 1,
      m: { xs: 2, md: 2 },
      mr: { xs: 12, md: 12, lg: 12, xl: 2 },
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default PageSectionWrapper;