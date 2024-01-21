import { TopFiveList } from "../../common/types";
import React, { useState } from "react";

import styles from "./TopFive.module.css";
import Image from "next/image";
import Link from "next/link";
import Heading from "../Heading/Heading";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Alert, Snackbar } from "@mui/material";
import { APIWrapper } from "@/common/apiWrapper";
import LoadingIcon from "../LoadingIcon/LoadingIcon";
import Body from "../Body/Body";

interface TopFiveProps extends TopFiveList {
  userColour?: string;
  belongsToCurrentUser?: boolean;
}

const TopFive: React.FC<TopFiveProps> = ({
  id,
  author,
  title,
  list,
  colour,
  userColour = "#888",
  belongsToCurrentUser = true,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onDeleteIconClick = () => {
    setDeleteModalVisible(true);
  };

  const onCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const onDelete = () => {
    setIsLoading(true);
    APIWrapper.deleteList(process.env.NEXT_PUBLIC_API_URL || "", id)
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

  return (
    <div className={styles.listContainer} style={{ backgroundColor: colour }}>
      <Link
        href={`/profile/${author.provider}/${author.providerId}`}
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
      <div className={styles.cardActions}>
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
                <Body content="Cancel" />
              </button>
              <button
                className={`${styles.modalButton} ${styles.delete}`}
                onClick={onDelete}
              >
                <Body content="Delete" />
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

export default TopFive;
