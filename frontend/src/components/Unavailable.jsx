import React from "react";
import { Box, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { getColorTokens } from "../theme/theme.js";
const Unavailable = ({ moduleName }) => {
  const colors = getColorTokens(useTheme().palette.mode);
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "100%", // Takes full viewport height
        // These colors will ideally come from your custom theme's palette
        // For example: backgroundColor: (theme) => theme.palette.background.default,
        // backgroundColor: colors.grey[100], // Example using a lighter grey from MUI's default colors
        padding: "24px",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          // p: 4,
          borderRadius: "8px",
          boxShadow: 3, // MUI shadow level 3
          // These colors will ideally come from your custom theme's palette
          // For example: backgroundColor: (theme) => theme.palette.background.paper,
          backgroundColor: colors.grey[50], // Example using a very light grey
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            // This color will ideally come from your custom theme's palette
            // For example: color: (theme) => theme.palette.text.primary,
            color: colors.grey[800], // Example for dark text
            fontWeight: 600,
          }}
        >
          {moduleName} Module
        </Typography>
        <Typography
          variant="h6"
          sx={{
            // This color will ideally come from your custom theme's palette
            // For example: color: (theme) => theme.palette.text.secondary,
            color: colors.grey[700], // Example for secondary text
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          This feature is not available right now. Please check back later!
        </Typography>
        <Box sx={{ mt: 3 }}>
          {/* You can add other components here, they will also pick up your theme */}
          {/* <Button variant="contained" color="primary">Go Back</Button> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Unavailable;
