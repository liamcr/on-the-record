import { UserCondensed } from "@/common/types";
import Image from "next/image";
import React from "react";

import styles from "./ProfileImage.module.css";

interface ProfileImageProps extends UserCondensed {
  /**
   * The width (and height) of the image
   */
  width?: string;

  /**
   * The height (and width) of the image
   */
  height?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  name,
  profilePictureSrc,
  width,
  height,
}) => {
  let style = {};
  if (width) {
    style = { width };
  } else if (height) {
    style = { height };
  }

  return (
    <div className={styles.profilePictureContainer} style={style}>
      <Image
        alt={`${name}'s profile picture`}
        src={profilePictureSrc}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: "cover",
        }}
      ></Image>
    </div>
  );
};

export default ProfileImage;
