import React from "react";
import Heading from "@/components/Heading/Heading";

import styles from "./page.module.css";
import ColourSelection from "@/components/ColourSelection/ColourSelection";

interface ColourProps {
  /**
   * The function that runs whenever a user selects a new colour
   * @param arg0 The new colour that the user has selected
   * @returns
   */
  onChange: (arg0: string) => void;
}

const Colour: React.FC<ColourProps> = ({ onChange }) => {
  return (
    <div className={styles.onboardingContainer}>
      <Heading
        component="h1"
        content="A Couple More Things"
        className={styles.titleBase}
      />
      <Heading
        component="h2"
        content="What's your favourite colour?"
        className={styles.subtitleBase}
      />
      <ColourSelection
        colours={[
          "#1A2EE3",
          "#148D19",
          "#F6A120",
          "#CC1BE9",
          "#E23A3A",
          "#E2CF23",
        ]}
        onChange={onChange}
      />
      <div style={{ height: "10vh" }} />
    </div>
  );
};

export default Colour;
