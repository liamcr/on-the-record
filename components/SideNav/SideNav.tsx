import React, { useState } from "react";

import styles from "./SideNav.module.css";
import Logo from "../Logo/Logo";
import Link from "next/link";
import Body from "@/components/Body/Body";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
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
  /**
   * True if the user is a guest
   */
  isGuest: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ colour, userId, isGuest }) => {
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
          {!isGuest && (
            <Link className={styles.sideNavButton} href={`/profile/${userId}`}>
              <PersonOutlinedIcon />
              <Body className={styles.sideNavButtonText} content="Profile" />
            </Link>
          )}
          <div
            className={styles.sideNavButton}
            onClick={() => setSearchEnabled(true)}
          >
            <SearchOutlinedIcon />
            <Body className={styles.sideNavButtonText} content="Search" />
          </div>
          {!isGuest && (
            <Link className={styles.sideNavButton} href="/api/auth/logout">
              <LogoutIcon />
              <Body className={styles.sideNavButtonText} content="Log Out" />
            </Link>
          )}
          {!isGuest && (
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
          )}
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
