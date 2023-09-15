import React, { useMemo } from "react";
import { Review } from "../../common/types";
import Image from "next/image";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";
import Link from "next/link";

import styles from "./ReviewCard.module.css";
import useImageData from "./useImageData";
import { generatePalette } from "../../common/functions";

// TODO: Make this CSS variable that works for light/dark modes?
const cardDefaultColour = "rgba(128, 128, 128, 0.10)";

const ReviewCard: React.FC<Review> = ({
  author,
  score,
  src,
  subtitle,
  title,
  type,
  colour,
  review,
}) => {
  const imageData = useImageData(src);

  const dominantColor = useMemo(() => {
    if (imageData.length === 0) return "rgba(128, 128, 128, 0.10)";

    let palette = generatePalette(imageData);
    if (palette.length !== 2) return "rgba(128, 128, 128, 0.10)";

    return `rgba(${palette[1].r}, ${palette[1].g}, ${palette[1].b}, 0.8)`;
  }, [imageData]);

  return (
    <div
      className={styles.reviewCard}
      style={{
        background: `linear-gradient(180deg, ${dominantColor} 0%, ${cardDefaultColour} 100%)`,
      }}
    >
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
      <div className={styles.reviewHeader}>
        <div className={styles.coverArtSection}>
          <div className={styles.imageContainer}>
            <Image
              src={src}
              alt={`${title} cover art`}
              fill
              style={{ aspectRatio: 1 }}
              className={styles.coverArt}
            />
          </div>
        </div>
        <div className={styles.reviewInfo}>
          <div className={styles.titlesContainer}>
            <Heading
              component="h3"
              content={title}
              className={styles.reviewTitle}
            />
            <Body content={subtitle} className={styles.reviewSubtitle} />
          </div>
          {/* <ReviewScore editable={false} score={score} /> */}
        </div>
      </div>
      {review && (
        <>
          <Heading component="h4" content="Review" />
          <Body className={styles.reviewBody} content={review} />
        </>
      )}
    </div>
  );
};

export default ReviewCard;
