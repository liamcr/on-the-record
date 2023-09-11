import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import ProfileImage from "../components/ProfileImage/ProfileImage";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/ProfileImage",
  component: ProfileImage,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithWidth: Story = {
  args: {
    id: 101,
    name: "Liam Crocket",
    profilePictureSrc: TestProfilePic.src,
    width: "300px",
  },
};

export const WithHeight: Story = {
  args: {
    id: 101,
    name: "Liam Crocket",
    profilePictureSrc: TestProfilePic.src,
    height: "300px",
  },
};
