import Image from "next/image";
import React from "react";

import styles from "./MusicNote.module.css";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";

interface MusicNoteProps {
  /**
   * Title of the music note
   */
  title: string;
  /**
   * Subtitle of the music note (typically the artist name)
   */
  subtitle?: string;
  /**
   * Prompt to display on the reverse side of the note
   */
  prompt: string;
  /**
   * Image src of the track/album/artist picture
   */
  src: string;
  /**
   * Can the user remove/add a music note?
   */
  editable?: boolean;
  /**
   * CSS styles to apply to the parent div
   */
  style?: React.CSSProperties;
}

const MusicNote: React.FC<MusicNoteProps> = ({
  title,
  subtitle,
  src,
  style,
  prompt,
  editable = false,
}) => {
  return (
    <div className={styles.musicNote} style={style}>
      <div className={styles.musicNoteInner}>
        <div className={styles.musicNoteFront}>
          <div className={styles.imageContainer}>
            <Image className={styles.image} src={src} alt={title} fill />
          </div>
          <div className={styles.gradientOverlay}></div>
          <div className={styles.titlesContainer}>
            <Heading component="h5" content={title} className={styles.title} />
            {subtitle && (
              <Body content={subtitle} className={styles.subtitle} />
            )}
          </div>
        </div>
        <div className={styles.musicNoteBack}>
          <div className={styles.musicNoteLine} />
          <Body content={prompt} className={styles.musicNotePrompt} />
          <div className={styles.musicNoteLine} />
        </div>
      </div>
    </div>
  );
};

export default MusicNote;
