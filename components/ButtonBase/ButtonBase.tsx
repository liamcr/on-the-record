import React from "react";

import styles from "./ButtonBase.module.css";

const ButtonBase: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ className, children, ...props }) => {
  return (
    <button className={`${styles.base} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default ButtonBase;
