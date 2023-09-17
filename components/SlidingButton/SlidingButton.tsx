import React, { useEffect, useRef, useState } from "react";

import styles from "./SlidingButton.module.css";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import Body from "../Body/Body";
import { body } from "../..//common/fonts";

interface SlidingButtonProps {
  /**
   * MUI icon to render next to the text
   */
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  /**
   * Icon font size
   */
  iconSize: string;
  /**
   * Text to display next to the icon
   */
  text: string;
  /**
   * Font size of the text
   */
  textSize: string;
  /**
   * Function to run when the button is clicked
   *
   * @returns
   */
  onClick: () => any;
  /**
   * Is the button going to slide in/out on hover?
   */
  animated?: boolean;
}

const SlidingButton: React.FC<SlidingButtonProps> = ({
  icon,
  iconSize,
  text,
  textSize,
  onClick,
  animated: interactive = true,
}) => {
  const Icon = icon;
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const onMouseEnter = () => {
    setIsHovering(true);
  };

  const onMouseExit = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={styles.slidingButton}
      style={{
        width:
          isHovering || !interactive
            ? `calc(${iconSize} + ${textRef.current?.offsetWidth}px)`
            : iconSize,
      }}
      onMouseEnter={interactive ? onMouseEnter : () => {}}
      onMouseLeave={interactive ? onMouseExit : () => {}}
      onClick={onClick}
    >
      <Icon style={{ fontSize: iconSize }} />
      <p
        style={{ fontSize: textSize }}
        ref={textRef}
        className={`${body.className} ${styles.text}`}
      >
        {text}
      </p>
    </div>
  );
};

export default SlidingButton;
