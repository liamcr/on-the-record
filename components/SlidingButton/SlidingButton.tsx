import React, { useRef, useState } from "react";

import styles from "./SlidingButton.module.css";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
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
   * Name of the HTML class of the parent div
   */
  className?: string;
}

const SlidingButton: React.FC<SlidingButtonProps> = ({
  icon,
  iconSize,
  text,
  onClick,
  className,
}) => {
  const Icon = icon;

  return (
    <div className={`${styles.slidingButton} ${className}`} onClick={onClick}>
      <Icon className={styles.icon} style={{ fontSize: iconSize }} />
      <p className={`${body.className} ${styles.text}`}>{text}</p>
    </div>
  );
};

export default SlidingButton;
