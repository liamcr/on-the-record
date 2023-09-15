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
    timestamp: "Sep. 15th, 2023",
    id: 102,
    score: 8,
    src: "https://i.scdn.co/image/ab67616d0000b273e71dd15fc5bdefd5bff70452",
    subtitle: "Chance the Rapper",
    title: "Coloring Book",
    type: EntityType.Album,
  },
};

export const ToPimpAButterfly: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    timestamp: "Sep. 15th, 2023",
    id: 102,
    score: 10,
    src: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1",
    subtitle: "Kendrick Lamar",
    title: "To Pimp A Butterfly",
    type: EntityType.Album,
  },
};

export const SOS: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    timestamp: "Sep. 15th, 2023",
    id: 102,
    score: 8,
    src: "https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874ec1",
    subtitle: "SZA",
    title: "SOS",
    type: EntityType.Album,
  },
};

export const TheLifeOfPablo: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    timestamp: "Sep. 15th, 2023",
    id: 102,
    score: 8,
    src: "https://i.scdn.co/image/ab67616d0000b2732a7db835b912dc5014bd37f4",
    subtitle: "Kanye West",
    title: "The Life of Pablo",
    type: EntityType.Album,
  },
};
