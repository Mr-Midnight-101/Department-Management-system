import { useTheme } from "@emotion/react";
import React from "react";
import { getColorTokens } from "../theme/theme";

const RegisterButtons = ({ ButtonLabel, tableHeading, openDialog }) => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  return (
    <Box
      sx={{
        flex: 1,
        m: {
          xs: 2,
          md: 2,
        },
        mr: {
          xs: 12,
          md: 12,
          lg: 12,
          xl: 2,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          gap: {
            xs: 1,
            sm: 0,
          },
          my: 2,
          mr: 0,
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1.6rem",
              sm: "2rem",
            },
            color: colors.grey[800],
          }}
        >
          {tableHeading}
        </Typography>

        <IconButton
          onClick={() => openDialog}
          sx={{
            gap: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: 1,
            background: colors.primary[900],
            backgroundPosition: "center",
            color: colors.text[100],
            "&:hover": {
              background: colors.gradient[100],
            },
          }}
        >
          <PersonAddIcon />
          <Typography
            variant="h5"
            sx={{
              lineHeight: 1,
              fontWeight: {
                xs: 200,
                sm: 400,
              },
              color: colors.text[100],
            }}
          >
            {ButtonLabel}
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default RegisterButtons;
