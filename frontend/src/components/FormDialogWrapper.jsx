import { Box, Dialog, IconButton, Typography } from "@mui/material";
import React from "react";
import { CancelIcon } from "../utils/icons";

const FormDialogWrapper = ({
  children,
  dialogHeading,
  isDialogOpen,
  closeDialog,
  sx,
}) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      scroll="paper"
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            width: { xs: "80vw", sm: "40vw", md: "40vw" },
            height: { xs: "80vh", sm: "70vh", md: "60vh" },
            p: 2,
            ...sx,
          },
        },
      }}
    >
      {/* heading and close button */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box
          display="flex"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton sx={{}} onClick={closeDialog}>
            <CancelIcon sx={{ fontSize: "28px" }} />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="h3">{dialogHeading}</Typography>
        </Box>
      </Box>
      {children}
    </Dialog>
  );
};

export default FormDialogWrapper;
