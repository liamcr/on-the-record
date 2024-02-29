import React, { useEffect, useState } from "react";

import styles from "./LikeModal.module.css";
import { PostType, UserCondensed } from "@/common/types";
import Body from "../Body/Body";
import { APIWrapper } from "@/common/apiWrapper";
import Heading from "../Heading/Heading";
import LoadingIcon from "../LoadingIcon/LoadingIcon";
import Image from "next/image";

interface LikeModalProps {
  postId: number | string;
  postType: PostType;
  userColour: string;
  onClose: () => void;
}

const LikeModal: React.FC<LikeModalProps> = ({
  postId,
  postType,
  userColour,
  onClose,
}) => {
  const [likedUsers, setLikedUsers] = useState<UserCondensed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    APIWrapper.getPostLikes(postId, postType).then((resp) => {
      if (resp.error) {
        console.error(resp.error.message);
        setIsError(true);
      } else if (resp.data !== undefined) {
        setLikedUsers(resp.data);
      }

      setIsLoading(false);
    });
  }, [isLoading, setLikedUsers, setIsLoading, setIsError]);

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        onClose();
      }}
    >
      <div className={styles.modal}>
        <Heading className={styles.header} component="h3" content="Likes" />
        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loadingIconOuterContainer}>
              <div className={styles.loadingIconInnerContainer}>
                <LoadingIcon colour={userColour} />
              </div>
            </div>
          )}
          {likedUsers.length === 0 && !isLoading && (
            <div className={styles.noResults}>
              <Body className={styles.crickets} content="🦗 🦗 🦗" />
              <Body
                className={styles.noResultsText}
                content="There's nothing here..."
              />
            </div>
          )}
          {likedUsers.length > 0 &&
            likedUsers.map((user) => (
              <a
                key={user.id}
                className={styles.result}
                href={`/profile/${user.id}`}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={user.profilePictureSrc}
                    fill
                    alt={user.name}
                    className={styles.image}
                  />
                </div>
                <div className={styles.titlesContainer}>
                  <Body content={user.name} className={styles.title} />
                </div>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LikeModal;
