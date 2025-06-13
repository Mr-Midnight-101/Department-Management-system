import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import React from "react";
import { getColorTokens } from "../theme/theme";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const SearchBox = () => {
  const colors = getColorTokens(useTheme().palette.mode);
  return (
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
  );
};

export default SearchBox;
