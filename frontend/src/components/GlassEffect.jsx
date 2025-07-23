import { Box } from "@mui/material";
import React from "react";

const GlassEffect = ({ children, sx }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(8px)",
        borderRadius: 2,
        p: 2,
        border: "1px solid rgba(70, 66, 66, 0.5)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default GlassEffect;
