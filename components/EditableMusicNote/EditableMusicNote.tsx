import { Entity } from "@/common/types";
import React from "react";

import styles from "./EditableMusicNote.module.css";
import Image from "next/image";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface EditableMusicNoteProps {
  entity?: Entity;
  onSelect?: () => void;
  onRemove?: () => void;
}

const EditableMusicNote: React.FC<EditableMusicNoteProps> = ({
  entity,
  onSelect = () => {},
  onRemove = () => {},
}) => {
  return (
    <div className={styles.editableMusicNoteContainer}>
      {entity && (
        <button className={styles.deleteButton} onClick={onRemove}>
          <CloseRoundedIcon className={styles.deleteIcon} />
        </button>
      )}
      {entity ? (
        <>
          <div className={styles.imageContainer}>
            <Image
              className={styles.image}
              src={entity.imageSrc}
              alt={entity.title}
              fill
            />
          </div>
          <div className={styles.gradientOverlay}></div>
          <div className={styles.titlesContainer}>
            <Heading
              component="h4"
              content={entity.title}
              className={styles.title}
            />
            {entity.subtitle && (
              <Body content={entity.subtitle} className={styles.subtitle} />
            )}
          </div>
        </>
      ) : (
        <div className={styles.addContainer} onClick={onSelect}>
          <AddRoundedIcon className={styles.addIcon} />
        </div>
      )}
    </div>
  );
};

export default EditableMusicNote;
