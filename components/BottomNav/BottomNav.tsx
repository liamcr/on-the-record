import Link from "next/link";
import React, { useState } from "react";

import styles from "./BottomNav.module.css";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import SlidingButton from "../SlidingButton/SlidingButton";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import { Entity, EntityType } from "@/common/types";
import Search from "../Search/Search";

interface BottomNavProps {
  /**
   * The colour of the action button
   */
  colour: string;
  /**
   * The user's streaming service provider (spotify, apple music, etc.)
   */
  userProvider: string;
  /**
   * The ID corresponding to the user, as set by their straming service provider
   */
  userProviderId: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  colour,
  userProvider,
  userProviderId,
}) => {
  const [moreActionsEnabled, setMoreActionsEnabled] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);

  const onActionButtonClick = () => {
    setMoreActionsEnabled((prevState) => !prevState);
  };

  const onOverlayClick = () => {
    setMoreActionsEnabled(false);
  };

  const onUserSelect = (user: Entity) => {
    if (!user.href) return;

    window.location.href = user.href;
  };

  return (
    <>
      <div className={styles.bottomNavBar}>
        <div className={styles.navButtons}>
          <Link href="/home">
            <div className={styles.navButton}>
              <HomeOutlinedIcon className={styles.navIcon} />
            </div>
          </Link>
          <Link href={`/profile/${userProvider}/${userProviderId}`}>
            <div className={styles.navButton}>
              <PersonOutlinedIcon className={styles.navIcon} />
            </div>
          </Link>
          <div
            className={styles.navButton}
            onClick={() => {
              setSearchEnabled(true);
            }}
          >
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
          onClick={onActionButtonClick}
        >
          <AddRoundedIcon className={styles.actionButtonIcon} />
        </div>
      </div>
      <div
        className={`${styles.slidingButtonContainerBase} ${
          moreActionsEnabled
            ? styles.slidingButtonContainerEnabled
            : styles.slidingButtonContainerDisabled
        }`}
      >
        <SlidingButton
          icon={RateReviewOutlined}
          iconSize="1.5rem"
          text="Review"
          onClick={() => {
            window.location.href = "/new/review";
          }}
          className={styles.slidingButton}
        />
        <SlidingButton
          icon={ListOutlinedIcon}
          iconSize="1.5rem"
          text="List"
          onClick={() => {
            window.location.href = "/new/list";
          }}
          className={styles.slidingButton}
        />
      </div>
      {moreActionsEnabled && (
        <div onClick={onOverlayClick} className={styles.overlay} />
      )}
      <Search
        type={EntityType.User}
        enabled={searchEnabled}
        onClose={() => setSearchEnabled(false)}
        onSelect={onUserSelect}
      />
    </>
  );
};

export default BottomNav;
