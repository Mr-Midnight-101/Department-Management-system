import { Box, Typography } from "@mui/material";
import React from "react";

function PageHeading({ children }) {
  return (
    <Box sx={{ justifyItems: "center", m: 2 }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 600,
          letterSpacing:2
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default PageHeading;
