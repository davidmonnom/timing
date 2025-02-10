"use client";
import { createTheme } from "@mui/material/styles";

const font = "var(--primary-font)";
const theme = createTheme({
  typography: {
    fontFamily: font,
  },
  palette: {
    primary: {
      main: "#bc004d",
      // main: "#6641ca",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
});

theme.typography.h1 = {
  fontSize: "2.5rem",
  fontFamily: font,
  "@media (min-width:600px)": {
    fontSize: "5rem",
  },
};

theme.typography.h2 = {
  fontSize: "1rem",
  fontFamily: font,
  "@media (min-width:600px)": {
    fontSize: "1.3rem",
  },
};

theme.typography.h3 = {
  fontSize: "2rem",
  fontFamily: font,
  "@media (min-width:600px)": {
    fontSize: "3rem",
  },
};

theme.typography.h4 = {
  fontSize: "1rem",
  fontFamily: font,
  "@media (min-width:600px)": {
    fontSize: "1rem",
  },
};

export default theme;
