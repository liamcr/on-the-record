import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import { EntityType } from "../common/types";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/ReviewCard",
  component: ReviewCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColoringBook: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    id: 102,
    score: 8,
    src: "https://i.scdn.co/image/ab67616d0000b273e71dd15fc5bdefd5bff70452",
    subtitle: "Chance the Rapper",
    title: "Coloring Book",
    type: EntityType.Album,
  },
};
