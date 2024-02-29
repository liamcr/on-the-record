import React, { useEffect, useMemo, useRef, useState } from "react";
import { PostType, Review } from "../../common/types";
import Image from "next/image";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";
import Link from "next/link";

import styles from "./ReviewCard.module.css";
import ReviewScore from "../ReviewScore/ReviewScore";
import { body } from "../../common/fonts";
import { entityTypeStrings } from "@/common/consts";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Alert, Snackbar } from "@mui/material";
import { APIWrapper } from "@/common/apiWrapper";
import LoadingIcon from "../LoadingIcon/LoadingIcon";
import { formatRelativeTimestamp } from "@/common/functions";
import LikeCount from "../LikeCount/LikeCount";

interface ReviewProps extends Review {
  userColour?: string;
  belongsToCurrentUser?: boolean;
  numLikes: number;
  hasUserLiked: boolean;
}

const ReviewCard: React.FC<ReviewProps> = ({
  id,
  author,
  score,
  src,
  subtitle,
  title,
  type,
  colour,
  review,
  timestamp,
  userColour = "#888",
  belongsToCurrentUser = false,
  numLikes,
  hasUserLiked,
}) => {
  const reviewRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onShowClick = () => {
    setExpanded((oldVal) => !oldVal);
  };

  const onDeleteIconClick = () => {
    setDeleteModalVisible(true);
  };

  const onCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const onDelete = () => {
    setIsLoading(true);
    APIWrapper.deleteReview(id)
      .then((resp) => {
        if (!resp.error) {
          // Success!
          window.location.reload();
          return;
        }

        console.error(resp.error);
        setIsError(true);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const el = reviewRef.current;
    if (el !== null && el.offsetHeight < el.scrollHeight) {
      setIsOverflowing(true);
    }
  }, []);

  return (
    <div
      className={styles.reviewCard}
      style={{
        background: `linear-gradient(180deg, ${colour} 0%, rgba(var(--card-background-rgba)) 100%)`,
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
            <Body
              content={`${entityTypeStrings[type]} • ${subtitle}`}
              className={styles.reviewSubtitle}
            />
          </div>
          <ReviewScore editable={false} score={score} />
        </div>
      </div>
      {review && (
        <>
          <Heading
            component="h4"
            content="Review"
            className={styles.reviewTextHeader}
          />
          <Body
            className={`${styles.reviewBody} ${
              expanded ? "" : styles.reviewBodyCollapsed
            }`}
            content={review}
            ref={reviewRef}
          />
          {isOverflowing && (
            <div className={styles.showButtonContainer}>
              <p
                className={`${body.className} ${styles.showButton}`}
                onClick={onShowClick}
              >
                {expanded ? "Show less" : "Show more"}
              </p>
            </div>
          )}
        </>
      )}
      <div className={styles.cardActions}>
        <Body
          className={styles.timestampText}
          content={`${formatRelativeTimestamp(timestamp)}${
            belongsToCurrentUser ? " •" : ""
          }`}
        />
        <LikeCount
          userId={author.id}
          initialLikeCount={numLikes}
          hasUserLiked={hasUserLiked}
          postId={id}
          postType={PostType.Review}
          userColour={userColour}
        />
        {belongsToCurrentUser && (
          <button
            className={styles.cardActionButton}
            onClick={onDeleteIconClick}
          >
            <DeleteOutlinedIcon className={styles.cardActionIcon} />
          </button>
        )}
      </div>
      {deleteModalVisible && (
        <div
          className={styles.deleteModalOverlay}
          onClick={(event) => {
            if (event.target !== event.currentTarget) {
              return;
            }

            onCancelDelete();
          }}
        >
          <div className={styles.deleteModal}>
            <Heading
              className={styles.areYouSure}
              component="h3"
              content="Are You Sure?"
            />
            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalButton} ${styles.cancel}`}
                onClick={onCancelDelete}
              >
                <Body className={styles.deleteModalText} content="Cancel" />
              </button>
              <button
                className={`${styles.modalButton} ${styles.delete}`}
                onClick={onDelete}
              >
                <Body className={styles.deleteModalText} content="Delete" />
              </button>
            </div>
          </div>
          <Snackbar
            open={isError}
            autoHideDuration={6000}
            onClose={() => setIsError(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={() => setIsError(false)} severity="error">
              Something went wrong... Please try again later.
            </Alert>
          </Snackbar>
        </div>
      )}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingIconContainer}>
            <LoadingIcon colour={userColour} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
