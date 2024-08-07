import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#671414", // maroon
          600: "#541010",
          700: "#410d0d",
          800: "#2d0909",
          900: "#140505",
        },
        greenAccent: {
          100: "#dbdbdb",
          200: "#b7b7b7",
          300: "#949494",
          400: "#707070",
          500: "#4c4c4c",
          600: "#3a3a3a",
          700: "#292929",
          800: "#191919",
          900: "#0f0f0f",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#d0d1d5", // maroon
          200: "#a1a4ab", // maroon
          300: "#727681", // maroon
          400: "#1F2A40", // maroon
          500: "#671414", // maroon
          600: "#541010", // maroon
          700: "#410d0d", // maroon
          800: "#2d0909", // maroon
          900: "#140505", // maroon
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#f2f0f0",
          200: "#e0d5d5",
          300: "#a38080",
          400: "#856666",
          500: "#671414", // maroon
          600: "#541010",
          700: "#410d0d",
          800: "#2d0909",
          900: "#140505",
        },
        greenAccent: {
          100: "#dbdbdb",
          200: "#b7b7b7",
          300: "#949494",
          400: "#707070",
          500: "#4c4c4c",
          600: "#3a3a3a",
          700: "#292929",
          800: "#191919",
          900: "#0f0f0f",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#d0d1d5", // maroon
          200: "#a1a4ab", // maroon
          300: "#727681", // maroon
          400: "#1F2A40", // maroon
          500: "#671414", // maroon
          600: "#541010", // maroon
          700: "#410d0d", // maroon
          800: "#2d0909", // maroon
          900: "#140505", // maroon
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    components: {
      MuiTableRow: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#292929' : '#ffffff', // Light or dark background based on mode
          },
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
