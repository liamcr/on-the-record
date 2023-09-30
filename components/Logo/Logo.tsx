import React from "react";

import styles from "./Logo.module.css";
import { logo } from "../../common/fonts";

interface LogoProps {
  colour?: string;
}

const Logo: React.FC<LogoProps> = ({ colour = "gray" }) => {
  return (
    <div className={styles.logoContainer}>
      <svg
        className={styles.svg}
        viewBox="0 0 198 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M132.241 153.92C145.971 145.971 153.92 136.938 159.339 119.956"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M103.697 51.6679C95.7482 49.8614 82.0183 53.4745 75.8759 59.2555"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M61.0621 25.6533C47.3321 33.6022 33.2409 46.9708 23.8467 65.7592"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="99" cy="99" r="97" stroke="white" strokeWidth="4" />
        <path
          d="M115.624 46.9701L107.314 74.0686L123.573 89.9665L189.332 63.5905L176.686 39.0212L150.671 15.5358L128.27 6.86426L115.624 46.9701Z"
          fill="white"
        />
        <path
          d="M52.7552 117.788L72.9888 109.839L91.4158 124.653L70.0983 192.218L48.7808 183.908L24.5727 162.952L8.67493 134.77L52.7552 117.788Z"
          fill="white"
        />
        <circle cx="99.0037" cy="98.9996" r="28.9051" fill={colour} />
        <circle
          cx="99.0037"
          cy="98.9996"
          r="28.9051"
          fill="url(#paint0_linear_125_192)"
          fillOpacity="0.49"
        />
        <circle cx="99.3649" cy="99.3608" r="4.69708" fill="white" />
        <defs>
          <linearGradient
            id="paint0_linear_125_192"
            x1="77.3249"
            y1="81.6565"
            x2="115.263"
            y2="119.956"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#868686" stopOpacity="0" />
            <stop offset="0.498256" stopColor="white" />
            <stop offset="1" stopColor="#939393" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <p className={`${styles.logoText} ${logo.className}`}>n The Record</p>
    </div>
  );
};

export default Logo;
