import Link from "next/link";
import React from "react";

import styles from "./BottomNav.module.css";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

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
        <div className={styles.navButtons}>
          <Link href="/home">
            <div className={styles.navButton}>
              <HomeOutlinedIcon className={styles.navIcon} />
            </div>
          </Link>
          <Link href="/profile">
            <div className={styles.navButton}>
              <PersonOutlinedIcon className={styles.navIcon} />
            </div>
          </Link>
          <div className={styles.navButton}>
            <SearchOutlinedIcon className={styles.navIcon} />
          </div>
        </div>
      </div>
      <div className={styles.actionButtonContainer}>
        <div
          className={styles.actionButton}
          style={{
            backgroundColor: colour,
          }}
        >
          <AddRoundedIcon className={styles.actionButtonIcon} />
        </div>
        {/* ..sliding buttons here */}
      </div>
    </>
  );
};

export default BottomNav;
