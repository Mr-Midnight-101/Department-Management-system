import React from "react";
import {
  DialogContent,
  Typography,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import { getColorTokens } from "../theme/theme";

const DeleteConfirmationDialogContent = ({
  entityName,
  onCancel,
  onConfirm,
}) => {
  const colors = getColorTokens(useTheme().palette.mode);
  return (
    <DialogContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: colors.text[100],
        }}
      >
        Are you sure you want to delete
        {entityName ? ` ${entityName}` : " this data"} ?
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This action cannot be undone.
      </Typography>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={onCancel} color="primary" variant="filled">
          {"Cancel"}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          style={{ marginLeft: 8 }}
        >
          {"Delete"}
        </Button>
      </Box>
    </DialogContent>
  );
};

export default DeleteConfirmationDialogContent;
