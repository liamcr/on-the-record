import React from "react";
import { header } from "../../common/fonts";

import "./Heading.common.css";

interface HeadingProps {
  component: "h1" | "h2" | "h3" | "h4" | "h5";
  content: string;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ component, content, className }) => {
  return React.createElement(
    component,
    {
      className: `${header.className} ${className ? className : ""}`,
    },
    content
  );
};

export default Heading;
