import React from "react";

import styles from "./page.module.css";
import Heading from "@/components/Heading/Heading";
import ImageUpload from "@/components/ImageUpload/ImageUpload";

interface ImageProps {
  /**
   * Function that gets run whenever the uploaded image changes.
   * @param arg0 URL of the uploaded image.
   * @returns
   */
  onChange: (arg0: string) => void;
  /**
   * The user's selected colour.
   */
  colour?: string;
}

const Image: React.FC<ImageProps> = ({ onChange, colour = "gray" }) => {
  return (
    <div className={styles.onboardingContainer}>
      <Heading
        component="h1"
        content="Upload a Profile Pic"
        className={styles.titleBase}
      />
      <Heading
        component="h2"
        content="This is optional and can be changed at any time."
        className={styles.subtitleBase}
      />
      <ImageUpload onChange={onChange} colour={colour} />
      <div style={{ height: "10vh" }} />
    </div>
  );
};

export default Image;
