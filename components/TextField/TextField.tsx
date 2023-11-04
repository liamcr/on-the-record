import React from "react";
import MuiTextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { ThemeProvider, createTheme } from "@mui/material";

const customTheme = (colour: string) =>
  createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#888888",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": colour,
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
            "& label": {
              color: "var(--TextField-brandBorderColor)",
            },
            "& .MuiInputBase-root": {
              color: "rgb(var(--foreground-rgb))",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(var(--text-field-background-rgba))",
            "&:hover": {
              backgroundColor: "rgba(var(--text-field-background-rgba))",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(var(--text-field-background-rgba))",
            },
            "&:before, &:after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&:before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });

const TextField = ({ colour = "gray", ...rest }) => {
  return (
    <ThemeProvider theme={customTheme(colour)}>
      <MuiTextField {...rest} inputProps={{ "aria-autocomplete": "none" }} />
    </ThemeProvider>
  );
};

export default TextField;
