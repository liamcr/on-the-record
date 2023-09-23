import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import SlidingButton from "../components/SlidingButton/SlidingButton";
import { EntityType } from "../common/types";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

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

export const List: Story = {
  args: {
    icon: ListOutlinedIcon,
    iconSize: "1rem",
    text: "List",
    onClick: () => {
      console.log("Clicked");
    },
  },
};

export const Review: Story = {
  args: {
    icon: RateReviewOutlinedIcon,
    iconSize: "1rem",
    text: "Review",
    onClick: () => {
      console.log("Clicked");
    },
  },
};

export const NotInteractive: Story = {
  args: {
    icon: RateReviewOutlinedIcon,
    iconSize: "1rem",
    text: "Review",
    animated: false,
    onClick: () => {
      console.log("Clicked");
    },
  },
};
