import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import SlidingButton from "../components/SlidingButton/SlidingButton";
import { EntityType } from "../common/types";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/SlidingButton",
  component: SlidingButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof SlidingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: ListOutlinedIcon,
    iconSize: "4rem",
    text: "List",
    textSize: "3rem",
  },
};
