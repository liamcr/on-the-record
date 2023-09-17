import React from "react";
import { body } from "../../common/fonts";

import "./Body.common.css";

interface BodyProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const Body: React.FC<BodyProps> = ({ content, className, style }) => {
  return (
    <p
      className={`${body.className} ${className ? className : ""}`}
      style={style}
    >
      {content}
    </p>
  );
};

export default Body;
