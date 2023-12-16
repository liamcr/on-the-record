import React, { useState } from "react";

import styles from "./ColourSelection.module.css";

interface ColourSelectionProps {
  colours: string[];
  onChange: (arg0: string) => void;
  isListSelection?: boolean;
}

const ColourSelection: React.FC<ColourSelectionProps> = ({
  colours,
  onChange,
  isListSelection = false,
}) => {
  const [selected, setSelected] = useState(-1);

  return (
    <div
      className={`${styles.colourSelectionContainer} ${
        isListSelection ? styles.listSelection : styles.profileSelection
      }`}
    >
      {colours.map((colour, i) => (
        <div
          className={`${styles.colourSelection} ${
            selected === i ? styles.selectedColour : ""
          }`}
          key={i}
          style={{
            border: `${
              selected === i ? colour : "rgb(var(--music-note-background-rgb))"
            } 2px solid`,
          }}
        >
          <div
            style={{ backgroundColor: colour }}
            className={styles.innerColourSelection}
            onClick={() => {
              setSelected(i);
              onChange(colour);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ColourSelection;
