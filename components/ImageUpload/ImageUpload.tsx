import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

import DefaultProfile from "../../public/defaultProfile.png";

import styles from "./ImageUpload.module.css";
import axios from "axios";
import LoadingIcon from "../LoadingIcon/LoadingIcon";

interface ImageUploadProps {
  /**
   * Callback function to be run whenever an image is uploaded.
   *
   * @param arg0 The S3 URL of the uploaded image
   * @returns
   */
  onChange: (arg0: string) => void;
  /**
   * The colour that will be displayed on the loading icon.
   */
  colour?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  colour = "gray",
}) => {
  const [url, setUrl] = useState(DefaultProfile.src);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length !== 1) {
      return;
    }
    setIsLoading(true);
    const fileToUpload = acceptedFiles[0];

    const fd = new FormData();
    fd.append("image", fileToUpload, fileToUpload.name);

    axios
      .post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status !== 200 || !res.data?.url) {
          // TODO: Handle errors
          return;
        }

        setUrl(res.data.url);
        onChange(res.data.url);
      })
      .catch((err) => {
        // TODO: Handle errors
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={styles.dropzoneContainer}
      style={{
        backgroundImage: `url(${url})`,
      }}
    >
      <input {...getInputProps()} />
      <div
        className={styles.fileUploadContainer}
        style={{
          opacity: isLoading ? 1 : "",
          cursor: isLoading ? "default" : "pointer",
        }}
      >
        {isLoading ? (
          <div className={styles.loadingIconContainer}>
            <LoadingIcon colour={colour} />
          </div>
        ) : (
          <FileUploadRoundedIcon className={styles.fileUploadIcon} />
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
