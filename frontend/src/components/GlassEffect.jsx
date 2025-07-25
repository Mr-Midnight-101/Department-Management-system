import { Box } from "@mui/material";
import React from "react";

const GlassEffect = ({ children, sx }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
        borderRadius: 2,
        p: 2,
         border: "1px solid rgba(70, 66, 66, 0.4)",
        // boxShadow: "rgba(81, 81, 152, 0.25) 0px 30px 50px -12px inset, rgba(145, 145, 145, 0.3) 0px 18px 26px -18px inset",
        // boxShadow: "0 4px 20px rgba(244, 242, 242, 0.2)",
        // background: "linear-gradient(145deg, #cacaca, #f0f0f0)",

        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default GlassEffect;
