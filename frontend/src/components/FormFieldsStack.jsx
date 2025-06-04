import { Box } from "@mui/material";
import React from "react";

const FormFieldsStack = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="12px"
      sx={{
        flex: 1,
        mt: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default FormFieldsStack;
