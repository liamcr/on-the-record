import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import DefaultProfile from "../../public/defaultProfile.png";

import styles from "./ImageUpload.module.css";
import axios from "axios";
import LoadingIcon from "../LoadingIcon/LoadingIcon";
import Image from "next/image";

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
  /**
   * Initial image URL to render when the component first mounts.
   */
  initialUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  colour = "gray",
  initialUrl = DefaultProfile.src,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
          setIsError(true);

          return;
        }

        setUrl(res.data.url);
        onChange(res.data.url);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop,
    disabled: isLoading,
    maxFiles: 1,
    maxSize: 10485760, // 10 MiB
  });

  return (
    <div {...getRootProps()} className={styles.dropzoneContainer}>
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
      <div className={styles.profilePicContainer}>
        <Image
          className={styles.profilePic}
          alt="Profile picture"
          src={url}
          fill
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setIsLoading(false);
            setIsError(true);
          }}
        />
      </div>
      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={() => setIsError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setIsError(false)} severity="error">
          Something went wrong uploading your image
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ImageUpload;
