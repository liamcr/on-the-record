import React, { useState } from "react";

import styles from "./LikeCount.module.css";
import { PostType } from "@/common/types";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Body from "../Body/Body";
import { APIWrapper } from "@/common/apiWrapper";
import LikeModal from "../LikeModal/LikeModal";

interface LikeCountProps {
  userId: string;
  initialLikeCount: number;
  hasUserLiked: boolean;
  postId: number | string;
  postType: PostType;
  userColour: string;
}

const LikeCount: React.FC<LikeCountProps> = ({
  userId,
  initialLikeCount,
  hasUserLiked,
  postId,
  postType,
  userColour,
}) => {
  const [numLikes, setNumLikes] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(hasUserLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onNumLikesClick = () => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onLikeClick = () => {
    setIsLoading(true);

    if (isLiked) {
      setIsLiked(false);
      setNumLikes((prevVal) => prevVal - 1);

      APIWrapper.unlikePost(userId, postId, postType).then((resp) => {
        if (!resp.data) {
          setIsLiked(true);
          setNumLikes((prevVal) => prevVal + 1);
        }

        setIsLoading(false);
      });
    } else {
      setIsLiked(true);
      setNumLikes((prevVal) => prevVal + 1);

      APIWrapper.likePost(userId, postId, postType).then((resp) => {
        if (!resp.data) {
          setIsLiked(false);
          setNumLikes((prevVal) => prevVal - 1);
        }

        setIsLoading(false);
      });
    }
  };

  return (
    <div className={styles.likeCount}>
      <button className={styles.cardActionButton} onClick={onNumLikesClick}>
        <Body
          className={`${styles.numLikes} ${
            postType == PostType.List ? styles.listIcon : styles.reviewIcon
          }`}
          content={numLikes.toString()}
        />
      </button>
      <button
        className={styles.cardActionButton}
        onClick={onLikeClick}
        disabled={isLoading}
      >
        {isLiked ? (
          <ThumbUpAltIcon
            className={`${styles.cardActionIcon} ${
              postType == PostType.List ? styles.listIcon : styles.reviewIcon
            }`}
          />
        ) : (
          <ThumbUpOffAltIcon
            className={`${styles.cardActionIcon} ${
              postType == PostType.List ? styles.listIcon : styles.reviewIcon
            }`}
          />
        )}
      </button>
      {isModalOpen && (
        <LikeModal
          onClose={onCloseModal}
          postId={postId}
          postType={postType}
          userColour={userColour}
        />
      )}
    </div>
  );
};

export default LikeCount;
