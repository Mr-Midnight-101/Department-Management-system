import { Box, IconButton, useTheme } from "@mui/material";
import { getColorTokens } from "../theme/theme";
import { DeleteOutlineIcon, EditNoteIcon } from "../utils/icons";

const GridActionButton = ({
  openUpdateDialog,
  openDeleteDialog,
  selectedRow,
}) => {
  //theme setup
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      sx={{ m: 1 }}
    >
      <IconButton
        onClick={() => openUpdateDialog(selectedRow)}
        sx={{
          borderRadius: 1,
          backgroundColor: colors.blue[100],
          color: colors.text[100],
        }}
        aria-label="edit"
      >
        <EditNoteIcon />
      </IconButton>
      <IconButton
        onClick={() => openDeleteDialog(selectedRow)}
        sx={{
          borderRadius: 1,
          backgroundColor: colors.red[100],
          color: colors.text[100],
        }}
        aria-label="delete"
      >
        <DeleteOutlineIcon />
      </IconButton>
    </Box>
  );
};

export default GridActionButton;
