import { TopFiveList } from "../../common/types";
import React from "react";

import styles from "./TopFive.module.css";
import Image from "next/image";
import Link from "next/link";
import Heading from "../Heading/Heading";

const TopFive: React.FC<TopFiveList> = ({ author, title, list, colour }) => {
  return (
    <div className={styles.listContainer} style={{ backgroundColor: colour }}>
      <Link
        href={`/profile/${author.id}`}
        className={styles.postProfileIconLink}
      >
        <div className={styles.postProfileIconContainer}>
          <Image
            src={author.profilePictureSrc}
            alt={`${author.name}'s profile picture`}
            fill
            className={styles.postProfileIcon}
          />
        </div>
      </Link>
      <Heading
        component="h3"
        content={`Top 5 ${title}`}
        className={styles.listTitle}
      />
      {list.map((listElement, i) => (
        <div key={i} className={styles.listElement}>
          <Heading
            component="h4"
            content={`${i + 1}.`}
            className={styles.listElementIndex}
          />
          <div className={styles.listElementImageContainer}>
            <Image
              src={listElement.src}
              alt={listElement.name}
              fill
              className={styles.listElementImage}
            />
          </div>
          <Heading
            component="h4"
            content={listElement.name}
            className={styles.listElementName}
          />
        </div>
      ))}
    </div>
  );
};

export default TopFive;
