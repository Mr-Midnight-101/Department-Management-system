import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import { AddIcon } from "../utils/icons.js";
import { getColorTokens } from "../theme/theme.js";
import PageHeading from "./PageHeading.jsx";
import GlassEffect from "./GlassEffect.jsx";
const GridHeaderWithAction = ({
  pageTitle,
  buttonLabel,
  onButtonClick,
  buttonSx = {},
}) => {
  const colors = getColorTokens(useTheme().palette.mode);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageHeading>{pageTitle}</PageHeading>
      <Box
        sx={{
          justifyItems: {
            xs: "center",
            sm: "right",
          },
        }}
      >
        {onButtonClick && (
          <Button
            onClick={onButtonClick}
            sx={{
              color: colors.text[100],
              background: colors.gradient[100],
              "& :hover": {
                background: "transparent",
              },
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
              ...buttonSx,
              m: 0,
              p: 0,
            }}
          >
            <GlassEffect
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "4px",
                m: 0,
              }}
            >
              {/* <AddIcon color="inherit" /> */}
              <Typography
                variant="h6"
                sx={{
                  color: colors.text[100],
                  // lineHeight: 1,
                  fontWeight: 500,
                  letterSpacing: 1,
                }}
              >
                {buttonLabel}
              </Typography>
            </GlassEffect>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GridHeaderWithAction;
