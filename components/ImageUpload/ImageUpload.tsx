import React from "react";
import { useDropzone } from "react-dropzone";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

import DefaultProfile from "../../public/defaultProfile.png";

import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  /**
   * Callback function to be run whenever an image is uploaded.
   *
   * @param arg0 The S3 URL of the uploaded image
   * @returns
   */
  onChange: (arg0: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: () => {
      onChange("123");
    },
  });

  return (
    <div
      {...getRootProps()}
      className={styles.dropzoneContainer}
      style={{
        backgroundImage: `url(${DefaultProfile.src})`,
      }}
    >
      <input {...getInputProps()} />
      <div className={styles.fileUploadContainer}>
        <FileUploadRoundedIcon className={styles.fileUploadIcon} />
      </div>
    </div>
  );
};

export default ImageUpload;
