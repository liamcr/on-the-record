import React from "react";

import styles from "./ButtonBase.module.css";

interface ButtonBaseProps {
  style?: React.CSSProperties;
  onClick?: () => any;
}

const ButtonBase: React.FC<React.PropsWithChildren<ButtonBaseProps>> = ({
  style,
  onClick,
  children,
}) => {
  return (
    <button className={styles.base} style={style} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonBase;
