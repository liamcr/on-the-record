import React, { useEffect, useMemo, useRef, useState } from "react";

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
   * Function to run when the button is clicked
   *
   * @returns
   */
  onClick: () => any;
  /**
   * Is the button going to slide in/out on hover?
   */
  animated?: boolean;
  /**
   * Name of the HTML class of the parent div
   */
  className?: string;
}

const SlidingButton: React.FC<SlidingButtonProps> = ({
  icon,
  iconSize,
  text,
  onClick,
  animated: interactive = true,
  className,
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
      className={`${styles.slidingButton} ${className}`}
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
      <Icon className={styles.icon} style={{ fontSize: iconSize }} />
      <p ref={textRef} className={`${body.className} ${styles.text}`}>
        {text}
      </p>
    </div>
  );
};

export default SlidingButton;
