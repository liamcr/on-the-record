import React from "react";
import { body } from "../../common/fonts";

import "./Body.common.css";

interface BodyProps {
  content: string;
  className?: string;
}

const Body: React.FC<BodyProps> = ({ content, className }) => {
  return (
    <p className={`${body.className} ${className ? className : ""}`}>
      {content}
    </p>
  );
};

export default Body;
