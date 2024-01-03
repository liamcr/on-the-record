import React from "react";
import { body } from "../../common/fonts";

import "./Body.common.css";

interface BodyProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ content, className, style }, ref) => {
    return (
      <p
        className={`${body.className} ${className ? className : ""}`}
        style={style}
        ref={ref}
      >
        {content}
      </p>
    );
  }
);

export default Body;
