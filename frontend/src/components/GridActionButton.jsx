import { Box, IconButton, Typography, useTheme } from "@mui/material";
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
      gap={1}
    >
      <IconButton
        onClick={() => openUpdateDialog(selectedRow)}
        sx={{
          borderRadius: 1,
          backgroundColor: colors.blue[100],
          color: colors.text[100],
          display: "flex",
          gap: 1,
          px:2
        }}
        aria-label="edit"
      >
        <EditNoteIcon />{" "}
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {"Modify"}
        </Typography>
      </IconButton>
      <IconButton
        onClick={() => openDeleteDialog(selectedRow)}
        sx={{
          borderRadius: 1,
          backgroundColor: colors.red[100],
          color: colors.text[100],
          display: "flex",
          gap: 1,
          px:2
        }}
        aria-label="delete"
      >
        <DeleteOutlineIcon />
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {"Delete"}
        </Typography>
      </IconButton>
    </Box>
  );
};

export default GridActionButton;
