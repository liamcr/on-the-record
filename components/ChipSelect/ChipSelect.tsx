import React from "react";

import styles from "./ChipSelect.module.css";
import Body from "../Body/Body";

interface ChipSelectProps {
  options: string[];
  selectedColour: string;
  onChange?: (arg0: string) => void;
  selected?: string;
}

const ChipSelect: React.FC<ChipSelectProps> = ({
  options,
  selectedColour,
  onChange = () => {},
  selected,
}) => {
  return (
    <div className={styles.optionsContainer}>
      {options.map((option, i) => (
        <div
          className={styles.option}
          onClick={() => onChange(option)}
          key={i}
          style={{
            backgroundColor:
              option === selected
                ? `${selectedColour}40`
                : "rgba(var(--review-score-background-rgba))",
          }}
        >
          <Body content={option} />
        </div>
      ))}
    </div>
  );
};

export default ChipSelect;
