import type { Meta, StoryObj } from "@storybook/react";

import TestProfilePic from "./assets/TestProfilePic.jpg";
import { EntityType } from "../common/types";
import MusicNoteStory from "./MusicNoteStory";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/MusicNote",
  component: MusicNoteStory,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof MusicNoteStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Waves: Story = {
  args: {
    title: "Waves",
    subtitle: "Kanye West",
    src: "https://i.scdn.co/image/ab67616d0000b2732a7db835b912dc5014bd37f4",
    prompt: "Best Work-Out Song",
    style: {
      width: "30vw",
    },
  },
};

export const ToPimpAButterfly: Story = {
  args: {
    title: "To Pimp A Butterfly",
    subtitle: "Kendrick Lamar",
    src: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1",
    prompt: "My Favourite Album",
    style: {
      width: "30vw",
    },
  },
};

export const TaylorSwift: Story = {
  args: {
    title: "Taylor Swift",
    src: "https://i.scdn.co/image/ab6761610000e5eb6a224073987b930f99adc706",
    prompt: "My Favourite Artist",
    style: {
      width: "30vw",
    },
  },
};
