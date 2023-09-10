import type { Meta, StoryObj } from "@storybook/react";

import PostProfileIcon from "../components/PostProfileIcon/PostProfileIcon";
import TestProfilePic from "./assets/TestProfilePic.jpg";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/PostProfileIcon",
  component: PostProfileIcon,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof PostProfileIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    id: 101,
    name: "Liam Crocket",
    profilePictureSrc: TestProfilePic.src,
    width: 250,
  },
};
