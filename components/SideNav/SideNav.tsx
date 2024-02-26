import React, { useState } from "react";

import styles from "./SideNav.module.css";
import Logo from "../Logo/Logo";
import Link from "next/link";
import Body from "@/components/Body/Body";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Search from "../Search/Search";
import { Entity, EntityType } from "@/common/types";

interface SideNavProps {
  /**
   * The colour of the action buttons
   */
  colour: string;
  /**
   * The user's ID
   */
  userId: string;
}

const SideNav: React.FC<SideNavProps> = ({ colour, userId }) => {
  const [searchEnabled, setSearchEnabled] = useState(false);

  const onUserSelect = (user: Entity) => {
    if (!user.href) return;

    window.location.href = user.href;
  };

  return (
    <>
      <nav className={styles.sideNav}>
        <div
          className={styles.logoContainer}
          onClick={() => {
            window.location.href = "/home";
          }}
        >
          <Logo colour={colour} shortened={true} />
        </div>
        <div className={styles.navButtonsContainer}>
          <Link className={styles.sideNavButton} href={"/home"}>
            <HomeOutlinedIcon />
            <Body className={styles.sideNavButtonText} content="Home" />
          </Link>
          <Link className={styles.sideNavButton} href={`/profile/${userId}`}>
            <PersonOutlinedIcon />
            <Body className={styles.sideNavButtonText} content="Profile" />
          </Link>
          <div
            className={styles.sideNavButton}
            onClick={() => setSearchEnabled(true)}
          >
            <SearchOutlinedIcon />
            <Body className={styles.sideNavButtonText} content="Search" />
          </div>
          <div className={styles.actionButtons}>
            <Link
              className={styles.largeButton}
              href={"/new/review"}
              style={{
                backgroundColor: `${colour}40`,
              }}
            >
              <RateReviewOutlined className={styles.largeButtonIcon} />
            </Link>
            <Link
              className={styles.largeButton}
              href={"/new/list"}
              style={{
                backgroundColor: `${colour}40`,
              }}
            >
              <ListOutlinedIcon className={styles.largeButtonIcon} />
            </Link>
          </div>
        </div>
      </nav>
      <Search
        type={EntityType.User}
        enabled={searchEnabled}
        onClose={() => setSearchEnabled(false)}
        onSelect={onUserSelect}
      />
    </>
  );
};

export default SideNav;
