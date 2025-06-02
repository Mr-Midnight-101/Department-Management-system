/* eslint-disable no-unused-vars */
import { createContext, useMemo, useState } from "react";
import { createTheme, Dialog, Paper, responsiveFontSizes } from "@mui/material";
import {
  DataGrid,
  GridCell,
  GridColumnHeaders,
  GridHeader,
  GridPanelContent,
} from "@mui/x-data-grid";

const lightGradient =
  "radial-gradient(circle at 70% 30%, rgba(255, 192, 203, 0.7), transparent 50%),radial-gradient(circle at 30% 70%, rgba(138, 43, 226, 0.7), transparent 50%),#f8f8f8";

const darkGradient =
  "radial-gradient(circle 300px at 75% 25%, rgba(255, 0, 127, 0.6), transparent 40%), radial-gradient(circle at 25% 75%, rgba(75, 0, 130, 0.6), transparent 40%), #000";
export const getColorTokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#f1f1f1",
          200: "#878d9d",
          300: "#707785",
          400: "#5a606c",
          500: "#444954",
          600: "#2e323d",
          700: "#191c24",
          800: "#13161c",
          900: "#0f1014",
        },
        secondary: {
          100: "#fce0eb",
          200: "#f8c2d2",
          300: "#f2a8c0",
          400: "#e177a1",
          500: "#cb4681",
          600: "#af1763",
          700: "#8c0f4b",
          800: "#5d0932",
          900: "#2b0418",
        },
        positive: {
          100: "#75D475", // base
        },
        negative: {
          100: "#FF5005", // base
        },
        blue: {
          100: "#0d6efd", // base
        },
        green: {
          100: "#198754", // base
        },
        cyan: {
          100: "#0dcaf0", // base
        },
        red: {
          100: "#ab2e3c", // base
        },
        yellow: {
          100: "#ffc107", // base
        },
        grey: {
          100: "#111111", // darkest
          200: "#4d4d4d",
          300: "#666666",
          400: "#808080",
          500: "#999999",
          600: "#b3b3b3",
          700: "#cccccc",
          800: "#e0e0e0",
          900: "#f5f5f5", // lightest
        },
        gradient: {
          100: darkGradient,
        },
        text: {
          100: "#ffffff",
          200: "#cccccc",
          300: "#888888",
        },
        background: {
          paper: "rgba(255, 255, 255, 0.8)",
        },
        clay: {
          100: "#21213A",
        },
        pink: {
          100: "#7A003D",
        },
        ArtyClick: {
          100: "#007399",
        },
      }
    : {
        ArtyClick: {
          100: "#CCF2FF",
        },
        pink: {
          100: "#FAE1ED",
        },
        primary: {
          100: "#0f1014",
          200: "#13161c",
          300: "#191c24", // base
          400: "#2e323d",
          500: "#444954",
          600: "#5a606c",
          700: "#707785",
          800: "#878d9d",
          900: "#f1f1f1",
        },
        secondary: {
          100: "#2b0418",
          200: "#5d0932",
          300: "#8c0f4b",
          400: "#af1763", // base
          500: "#cb4681",
          600: "#e177a1",
          700: "#f2a8c0",
          800: "#f8c2d2",
          900: "#fce0eb",
        },
        clay: {
          100: "#E1E1EB",
        },
        positive: {
          100: "#75D475", // base
        },
        negative: {
          100: "#FF5005", // base
        },
        blue: {
          100: "#85B5FE", // base
        },
        green: {
          100: "#389F6F", // base
        },
        cyan: {
          100: "#0dcaf0", // base
        },
        red: {
          100: "#DD9DA4", // base
        },
        yellow: {
          100: "#ffc107", // base
        },
        grey: {
          100: "#f5f5f5", // lightest
          200: "#e0e0e0",
          300: "#cccccc",
          400: "#b3b3b3",
          500: "#999999", // medium grey
          600: "#808080",
          700: "#666666",
          800: "#4d4d4d",
          900: "#111111", // darkest
        },
        background: {
          paper: "rgba(0, 0, 0, 0.6)",
        },
        gradient: {
          100: lightGradient,
        },
        text: {
          100: "#000000",
          200: "#333333",
          300: "#888888",
        },
      }),
});

export const createCustomTheme = (mode) => {
  const colors = getColorTokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[600],
            },
            secondary: {
              main: colors.secondary[500],
            },
            error: {
              main: colors.negative[100],
            },
            success: {
              main: colors.positive[100],
            },
            neutral: {
              main: colors.grey[500],
              dark: colors.grey[900],
              light: colors.grey[100],
            },
            background: {
              default: colors.background.paper,
              paper: colors.background.paper,
            },
            text: {
              primary: colors.text[100],
              secondary: colors.text[200],
              disabled: colors.text[300],
            },
          }
        : {
            primary: {
              main: colors.primary[600],
            },
            secondary: {
              main: colors.secondary[500],
            },
            error: {
              main: colors.negative[100],
            },
            success: {
              main: colors.positive[100],
            },
            neutral: {
              main: colors.grey[500],
              dark: colors.grey[800],
              light: colors.grey[200],
            },
            background: {
              default: colors.background.paper,
              paper: colors.background.paper,
            },
            text: {
              primary: colors.text[100],
              secondary: colors.text[200],
              disabled: colors.text[300],
            },
          }),
    },
    typography: {
      fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    components: {
      MuiMenu: {
        styleOverrides: {
          //footer menu panel
          paper: {
            backgroundColor: colors.primary[900], // or colors.black[700]
            color: colors.text[100],
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          //filter panel
          panelContent: {
            backgroundColor: colors.clay[100],
            color: colors.text[100],
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.primary[100],
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.green[500],
              },
              "&:hover fieldset": {
                borderColor: colors.cyan[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.grey[900],
              },
            },
          },
        },
      },
      //container css
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: colors.text[100],
            background: colors.gradient[100],
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            minHeight: "100vh",
          },
          ".MuiDataGrid-menu .MuiPaper-root": {
            backgroundColor: colors.pink[100] + " !important",
            color: colors.text[100] + " !important",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: colors.gradient[100],
            color: colors.text[100],
            border: `1px solid ${colors.grey[600]}`,
          },
        },
      },
    },
  };
};

export const ThemeModeContext = createContext({
  toggleColorMode: () => {},
});

export const useThemeMode = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  let theme = createTheme(createCustomTheme(mode), [mode]);
  theme = responsiveFontSizes(theme);
  return [theme, colorMode];
};
