import React from "react";
import MuiSelect, { SelectProps } from "@mui/material/Select";
import {
  FormControl,
  InputLabel,
  PaletteMode,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

const customTheme = (colour: string, mode: PaletteMode) =>
  createTheme({
    palette: {
      mode: mode,
    },
    components: {
      MuiFormControl: {
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

type CustomSelectProps = SelectProps & {
  colour?: string;
  label: string;
};

const Select = (props: React.PropsWithChildren<CustomSelectProps>) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <ThemeProvider
      theme={customTheme(
        props.colour ?? "gray",
        prefersDarkMode ? "dark" : "light"
      )}
    >
      <FormControl fullWidth variant="filled">
        <InputLabel>{props.label}</InputLabel>
        <MuiSelect {...props}>{props.children}</MuiSelect>
      </FormControl>
    </ThemeProvider>
  );
};

export default Select;
