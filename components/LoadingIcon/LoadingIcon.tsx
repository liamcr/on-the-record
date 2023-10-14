import React from "react";

import styles from "./LoadingIcon.module.css";

interface LogoProps {
  colour?: string;
}

const LoadingIcon: React.FC<LogoProps> = ({ colour = "gray" }) => {
  return (
    <div className={styles.loadingIconContainer}>
      <svg
        width="407"
        height="365"
        viewBox="0 0 407 365"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={styles.recordStrokes}>
          <path
            d="M226.883 288.98C250.378 275.378 263.98 259.92 273.253 230.861"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M178.038 114.004C164.435 110.913 140.94 117.096 130.43 126.988"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M105.08 69.4873C81.5848 83.0897 57.4715 105.966 41.396 138.117"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx="170"
            cy="195"
            r="167.411"
            stroke="white"
            strokeWidth="4"
          />
        </g>
        <path
          d="M198.447 105.965L184.227 152.337L212.05 179.542L324.578 134.407L302.938 92.3629L258.422 52.1741L220.088 37.3352L198.447 105.965Z"
          fill="white"
        />
        <path
          d="M90.8649 227.15L125.489 213.548L157.022 238.898L120.543 354.518L84.0637 340.297L42.6383 304.436L15.4336 256.21L90.8649 227.15Z"
          fill="white"
        />
        <circle
          cx="170.006"
          cy="194.999"
          r="49.4631"
          fill={colour}
          className={styles.recordFill}
        />
        <circle
          cx="170.006"
          cy="194.999"
          r="49.4631"
          fill="url(#paint0_linear_64_286)"
          fillOpacity="0.49"
        />
        <circle cx="170.624" cy="195.617" r="8.03776" fill="white" />
        <g className={styles.needle}>
          <circle
            cx="380.37"
            cy="38.8357"
            r="20.2584"
            transform="rotate(11.9464 380.37 38.8357)"
            stroke="#888888"
            strokeWidth="4"
          />
          <circle
            cx="380.37"
            cy="38.8355"
            r="3.70973"
            transform="rotate(11.9464 380.37 38.8355)"
            fill="#888888"
          />
          <path
            d="M334.176 242.67C333.833 244.291 334.87 245.883 336.49 246.226C338.111 246.569 339.704 245.533 340.047 243.912L334.176 242.67ZM373.084 58.7809L334.176 242.67L340.047 243.912L378.954 60.0228L373.084 58.7809Z"
            fill="#888888"
          />
          <line
            x1="336.854"
            y1="242.03"
            x2="287.018"
            y2="274.46"
            stroke="#888888"
            strokeWidth="6"
          />
          <rect
            x="244.201"
            y="287.366"
            width="64.8693"
            height="24.8365"
            rx="12.4183"
            transform="rotate(-33.0536 244.201 287.366)"
            fill="#888888"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_64_286"
            x1="132.909"
            y1="165.321"
            x2="197.829"
            y2="230.86"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#868686" stopOpacity="0" />
            <stop offset="0.498256" stopColor="white" />
            <stop offset="1" stopColor="#939393" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LoadingIcon;
