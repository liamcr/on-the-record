import React from "react";
import MuiTextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material";
import { header } from "@/common/fonts";

type breakpoint = "md" | "lg";

const customTheme = (
  colour: string,
  isTopFive: boolean,
  breakpoint: breakpoint
) =>
  createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": isTopFive ? "#333333" : "#888888",
            "--TextField-brandBorderHoverColor": isTopFive
              ? "#555555"
              : "#B2BAC2",
            "--TextField-brandBorderFocusedColor": colour,
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
            "& label": {
              color: "var(--TextField-brandBorderColor)",
            },
            "& .MuiInputBase-root": {
              color: isTopFive ? "#000" : "rgb(var(--foreground-rgb))",
              fontWeight: isTopFive ? "bold" : "normal",
              fontSize:
                isTopFive && breakpoint === "lg"
                  ? "2rem"
                  : isTopFive && breakpoint === "md"
                  ? "1.5rem"
                  : "inherit",
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            border: 0,
            lineHeight: 1,
            "& fieldset": {
              border: 0,
            },
            "& input": {
              paddingLeft: isTopFive ? "0.5rem" : "",
            },
            ...header.style,
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

const TextField = ({
  colour = "gray",
  isTopFive = false,
  breakpoint = "lg" as breakpoint,
  ...rest
}) => {
  return (
    <ThemeProvider theme={customTheme(colour, isTopFive, breakpoint)}>
      <MuiTextField {...rest} />
    </ThemeProvider>
  );
};

export default TextField;
