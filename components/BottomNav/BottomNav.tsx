import Link from "next/link";
import React from "react";

import styles from "./BottomNav.module.css";

interface BottomNavProps {
  /**
   * The colour of the action button
   */
  colour: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ colour }) => {
  return (
    <>
      <div className={styles.bottomNavBar}>
        <Link href="/home">Home</Link>
        <Link href="/profile">Profile</Link>
        <div>Search</div>
      </div>
      <div className={styles.actionButtonContainer}>
        <div
          className={styles.actionButton}
          style={{
            backgroundColor: colour,
          }}
        >
          +
        </div>
        {/* ..sliding buttons here */}
      </div>
    </>
  );
};

export default BottomNav;
