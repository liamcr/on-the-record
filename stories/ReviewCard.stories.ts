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

export const KidsSeeGhosts: Story = {
  args: {
    author: {
      id: 101,
      name: "Liam Crocket",
      profilePictureSrc: TestProfilePic.src,
    },
    timestamp: "Sep. 15th, 2023",
    id: 102,
    score: 9,
    src: "https://i.scdn.co/image/ab67616d0000b273013c00ee367dd85396f79c82",
    subtitle: "KIDS SEE GHOSTS, Kanye West, Kid Cudi",
    title: "KIDS SEE GHOSTS",
    type: EntityType.Album,
    review:
      '"Kids See Ghosts" is a collaborative album by two of the most innovative and influential figures in modern hip-hop, Kanye West and Kid Cudi. Released in 2018 as part of Kanye West\'s Wyoming Sessions, this seven-track project is a mesmerizing journey into the minds of these two artists as they explore themes of mental health, self-discovery, and spirituality.\n\nThe album opens with the haunting and atmospheric "Feel the Love," setting the tone for an ethereal and introspective experience. Kanye and Kid Cudi\'s chemistry is palpable throughout the project, with their distinct voices and styles complementing each other seamlessly. Tracks like "Fire" and "4th Dimension" showcase their lyrical prowess and creativity, while "Reborn" and "Cudi Montage" delve into deeply personal and emotional territory.\n\nWhat makes "Kids See Ghosts" stand out is its willingness to experiment with sound. The production, handled primarily by Kanye West, is a fusion of hip-hop, rock, and psychedelic elements, creating a sonic landscape that\'s both refreshing and boundary-pushing. The use of samples, from Kurt Cobain\'s vocals on "Cudi Montage" to Louis Prima\'s on "4th Dimension," adds an extra layer of depth to the album.\n\nLyrically, the album addresses issues of mental health and self-acceptance, with both artists candidly sharing their struggles and triumphs. It\'s a testament to the power of music as a therapeutic medium and a reminder that vulnerability can be a strength.\n\n"Kids See Ghosts" is not just an album; it\'s a sonic adventure that invites listeners to explore the complexities of the human psyche. It\'s a testament to the creative genius of Kanye West and Kid Cudi, both individually and as a duo. This project pushed the boundaries of hip-hop and showcased the transformative potential of collaboration in the genre. If you\'re looking for an album that challenges conventions and dives deep into the human experience, "Kids See Ghosts" is a must-listen.',
  },
};
