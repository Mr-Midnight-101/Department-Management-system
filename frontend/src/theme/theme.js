/* eslint-disable no-unused-vars */
import { createContext, useMemo, useState } from "react";
import { createTheme, Dialog, responsiveFontSizes } from "@mui/material";
import { GridFilterForm, GridPanel, GridPanelContent } from "@mui/x-data-grid";
import { green } from "@mui/material/colors";

const lightGradient = "linear-gradient(to right, #cc95c0, #dbd4b4, #7aa1d2)";
const darkGradient = "linear-gradient(to right, #5a3a59, #4c4a3e, #2c3e56)";
export const getColorTokens = (mode) => ({
  ...(mode === "dark"
    ? {
        black: {
          100: "#ccd5dd", //light
          200: "#99abbb",
          300: "#668098",
          400: "#335676",
          500: "#002c54", //Mid
          600: "#002343",
          700: "#001a32",
          800: "#001222",
          900: "#000911", //dark
        },
        red: {
          100: "#fad9dd", //light
          200: "#f6b3bc",
          300: "#f18d9a",
          400: "#ed6779",
          500: "#e84157", //Mid
          600: "#ba3446",
          700: "#8b2734",
          800: "#5d1a23",
          900: "#2e0d11", //dark
        },
        grey: {
          100: "#e6e6e6", //light
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080", //Mid
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a", //dark
        },
        white: {
          100: "ffffff",
        },
        background: {
          100: darkGradient,
          200: "#1e1e1e",
        },
      }
    : {
        black: {
          900: "#ccd5dd", //light
          800: "#99abbb",
          700: "#668098",
          600: "#335676",
          500: "#002c54", //Mid
          400: "#002343",
          300: "#001a32",
          200: "#001222",
          100: "#000911", //dark
        },
        red: {
          900: "#fad9dd", //light
          800: "#f6b3bc",
          700: "#f18d9a",
          600: "#ed6779",
          500: "#e84157", //Mid
          400: "#ba3446",
          300: "#8b2734",
          200: "#5d1a23",
          100: "#2e0d11", //dark
        },
        grey: {
          900: "#e6e6e6", //light
          800: "#cccccc",
          700: "#b3b3b3",
          600: "#999999",
          500: "#808080", //Mid
          400: "#666666",
          300: "#4d4d4d",
          200: "#333333",
          100: "#1a1a1a", //dark
        },
        white: {
          100: "ffffff",
        },
        background: {
          100: lightGradient,
          200: "#ffffff",
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
              main: colors.black[700],
            },
            secondary: {
              main: colors.red[700],
            },
            neutral: {
              main: colors.grey[700],
              dark: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.black[700],
              paper: colors.background.paper,
            },
          }
        : {
            primary: {
              main: colors.black[700],
            },
            secondary: {
              main: colors.red[700],
            },
            neutral: {
              main: colors.grey[700],
              dark: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.black[700],
              paper: colors.background.paper,
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
      MuiDataGrid: {
        styleOverrides: {
          menu: {
            // Styles for column menu (3-dots dropdown)
            backgroundColor: mode === "dark" ? "#000911" : "#ccd5dd", // Dark background
            color: mode === "dark" ? "#000911" : "#ccd5dd", // White text
          },
          panelContent: {
            backgroundColor: mode === "dark" ? "#000911" : "#ccd5dd",
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.black[100],
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[500],
              },
              "&:hover fieldset": {
                borderColor: colors.grey[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.grey[100],
              },
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.black[800], // or colors.black[700]
            color: colors.black[800]
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: mode === "dark" ? darkGradient : lightGradient,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            minHeight: "100vh",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: colors.grey[800],
            color: colors.grey[100],
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
