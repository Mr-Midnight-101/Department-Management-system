import { Box, Dialog } from "@mui/material";
import React from "react";

const UpdateStudent = ({ openDialog, closedialog, themeColors }) => {
  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={closedialog}
        sx={{ backgroundColor: themeColors.grey[100] }}
      ></Dialog>
    </Box>
  );
};

export default UpdateStudent;
