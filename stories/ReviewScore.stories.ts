import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import ReviewScore from "../components/ReviewScore/ReviewScore";
import { EntityType } from "../common/types";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/ReviewScore",
  component: ReviewScore,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NonEditable: Story = {
  args: {
    editable: false,
    score: 5,
  },
};

export const Editable: Story = {
  args: {
    editable: true,
  },
};
