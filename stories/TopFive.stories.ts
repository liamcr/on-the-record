import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import TopFive from "../components/TopFive/TopFive";
import { EntityType } from "../common/types";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/TopFive",
  component: TopFive,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof TopFive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlbumsOf2022: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    timestamp: "Sep. 15th, 2023",
    id: 102,
    title: "Albums of 2022",
    type: EntityType.Album,
    colour: "#DCD069",
    list: [
      {
        name: "Mr. Morale & The Big Steppers",
        src: "https://i.scdn.co/image/ab67616d0000b2732e02117d76426a08ac7c174f",
      },
      {
        name: "The Forever Story",
        src: "https://i.scdn.co/image/ab67616d0000b273cae6e44dcc84e2035c3ad092",
      },
      {
        name: "SOS",
        src: "https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874ec1",
      },
      {
        name: "Her Loss",
        src: "https://i.scdn.co/image/ab67616d0000b27302854a7060fccc1a66a4b5ad",
      },
      {
        name: "NO THANK YOU",
        src: "https://i.scdn.co/image/ab67616d0000b27372f48f1e2e04cc76d06ee708",
      },
    ],
  },
};

export const TaylorSwiftSongs: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    timestamp: "Sep. 15th, 2023",
    id: 102,
    title: "Taylor Swift Songs",
    type: EntityType.Album,
    colour: "#C67171",
    list: [
      {
        name: "All Too Well (Taylor's Version)",
        src: "https://i.scdn.co/image/ab67616d0000b273318443aab3531a0558e79a4d",
      },
      {
        name: "betty",
        src: "https://i.scdn.co/image/ab67616d0000b273c288028c2592f400dd0b9233",
      },
      {
        name: "Getaway Car",
        src: "https://i.scdn.co/image/ab67616d0000b273da5d5aeeabacacc1263c0f4b",
      },
      {
        name: "Cruel Summer",
        src: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
      },
      {
        name: "august",
        src: "https://i.scdn.co/image/ab67616d0000b273c288028c2592f400dd0b9233",
      },
    ],
  },
};
