import { UserCondensed } from "../../common/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import styles from "./PostProfileIcon.module.css";

interface PostProfileIconProps extends UserCondensed {
  /**
   * The width (and height) of the icon (in px)
   */
  width: number;
}

/**
 * The profile picture icon that appears at the top-left of
 * each post. Takes an id, name, and profile picure URL.
 */
const PostProfileIcon: React.FC<PostProfileIconProps> = ({
  id,
  name,
  profilePictureSrc,
  width,
}) => {
  return (
    <Link href={`/profile/${id}`}>
      <Image
        src={profilePictureSrc}
        alt={`${name}'s profile picture`}
        width={width}
        height={width}
        className={styles.postProfileIcon}
      ></Image>
    </Link>
  );
};

export default PostProfileIcon;
