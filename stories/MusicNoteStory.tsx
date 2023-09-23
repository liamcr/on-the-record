import MusicNote from "../components/MusicNote/MusicNote";
import React from "react";

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
   * CSS styles to apply to the parent div
   */
  style?: React.CSSProperties;
}

const MusicNoteStory: React.FC<MusicNoteProps> = (props) => {
  return <MusicNote {...props} />;
};

export default MusicNoteStory;
