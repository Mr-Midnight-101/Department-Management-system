import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { AddIcon } from "../utils/icons.js";
import { getColorTokens } from "../theme/theme.js";
const GridHeaderWithAction = ({
  pageTitle,
  buttonLabel,
  onButtonClick,
  sx = {},
  buttonSx = {},
}) => {
  const colors = getColorTokens(useTheme().palette.mode);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        gap: 1,
        my: 2,
        mr: 0,
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.6rem", sm: "2rem" },
          color: colors.text[100],
        }}
      >
        {pageTitle}
      </Typography>
      <Box
        sx={{
         
          "& :hover": { background: colors.gradient[100] },
        }}
      >
        <IconButton
          onClick={onButtonClick}
          sx={{
             color: colors.text[100],
            "& :hover": { background: "transparent" },
            gap: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: 1,
            ...buttonSx,
          }}
        >
          <AddIcon color="inherit" />
          <Typography
            variant="h5"
            sx={{
              color: colors.text[100],
              lineHeight: 1,
              fontWeight: { xs: 200, sm: 400 },
            }}
          >
            {buttonLabel}
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default GridHeaderWithAction;
