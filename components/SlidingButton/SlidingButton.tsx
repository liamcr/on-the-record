import React from "react";

import styles from "./SlidingButton.module.css";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import Body from "../Body/Body";

interface SlidingButtonProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  iconSize: string;
  text: string;
  textSize: string;
}

const SlidingButton: React.FC<SlidingButtonProps> = ({
  icon,
  iconSize,
  text,
  textSize,
}) => {
  const Icon = icon;
  return (
    <div className={styles.slidingButton}>
      <Icon style={{ fontSize: iconSize }} />
      <Body content={text} style={{ fontSize: textSize }} />
    </div>
  );
};

export default SlidingButton;
