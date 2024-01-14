"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

import styles from "./page.module.css";
import Heading from "@/components/Heading/Heading";
import EditableMusicNote from "@/components/EditableMusicNote/EditableMusicNote";
import { Entity, EntityType } from "@/common/types";
import Search from "@/components/Search/Search";
import ReviewScore from "@/components/ReviewScore/ReviewScore";
import TextField from "@/components/TextField/TextField";
import ChipSelect from "@/components/ChipSelect/ChipSelect";
import ButtonBase from "@/components/ButtonBase/ButtonBase";
import Body from "@/components/Body/Body";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { APIWrapper } from "@/common/apiWrapper";
import { StreamingService } from "@/common/streamingServiceFns";
import { Alert, Snackbar } from "@mui/material";

const nameToEntityType = {
  Track: EntityType.Track,
  Album: EntityType.Album,
};

const EntityTypeToName = ["Track", "Album"];

export default function NewReview() {
  const [entity, setEntity] = useState<Entity | undefined>();
  const [score, setScore] = useState<number | undefined>();
  const [body, setBody] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [selectedType, setSelectedType] = useState<EntityType | undefined>();
  const [userColour, setUserColour] = useState("#888");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colour = localStorage.getItem("otrColour");
    if (colour !== null) {
      setUserColour(colour);
    }
  }, []);

  useEffect(() => {
    // It's not always obvious that new fields are being added, so whenever a field
    // is changed, we should smooth-scroll to the bottom.
    pageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selectedType, entity, score]);

  const onBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };

  const onChipChange = (newValue: string) => {
    if (newValue !== "Track" && newValue !== "Album") {
      return;
    }
    pageRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
    setEntity(undefined);
    setScore(undefined);
    setBody("");
    setSelectedType(nameToEntityType[newValue]);
  };

  const onSubmit = () => {
    if (!entity || score === undefined) {
      return;
    }

    setIsLoading(true);
    APIWrapper.createReview(
      process.env.API_URL || "",
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrStreamingServiceId") || "",
      selectedType || EntityType.Track,
      entity?.title,
      entity?.subtitle || "",
      entity?.imageSrc,
      score,
      body
    )
      .then((resp) => {
        if (!resp.error) {
          // Success!
          window.location.href = "/home";
          return;
        }

        console.error(resp.error);
        setIsError(true);
      })
      .catch((e) => {
        console.error(e);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.outerPageContainer}>
      <div className={styles.pageContainer} ref={pageRef}>
        <Heading component="h1" content="New Review" />
        <Heading
          component="h2"
          content="What Are You Reviewing?"
          className={styles.subheading}
        />
        <ChipSelect
          options={["Track", "Album"]}
          selectedColour={userColour}
          onChange={onChipChange}
          selected={
            selectedType === undefined
              ? undefined
              : EntityTypeToName[selectedType]
          }
        />
        {selectedType !== undefined && (
          <>
            <Heading
              component="h2"
              content={`Select ${EntityTypeToName[selectedType]}`}
              className={styles.subheading}
            />
            <EditableMusicNote
              entity={entity}
              onSelect={() => {
                setSearchEnabled(true);
              }}
              onRemove={() => {
                setEntity(undefined);
                setScore(undefined);
                setBody("");
              }}
            />
          </>
        )}
        {entity && (
          <>
            <Heading
              component="h2"
              content="What Rating Would You Give?"
              className={styles.subheading}
            />
            <ReviewScore
              editable
              score={score}
              onChange={(updatedScore) => setScore(updatedScore)}
            />
          </>
        )}
        {entity && score && (
          <>
            <Heading
              component="h2"
              content="Tell Us More"
              className={styles.subheading}
            />
            <TextField
              colour="#888"
              multiline
              minRows={4}
              maxRows={10}
              onChange={onBodyChange}
              variant="filled"
              fullWidth
              label="Tell us more..."
              value={body}
              size="large"
            />
            <footer className={styles.submitContainer}>
              <ButtonBase
                className={styles.submitButton}
                style={{ backgroundColor: userColour }}
                onClick={onSubmit}
              >
                <Body className={styles.submitText} content="Submit" />
              </ButtonBase>
            </footer>
          </>
        )}
        <Search
          enabled={searchEnabled}
          onSelect={(selectedEntity) => {
            setEntity(selectedEntity);
            setSearchEnabled(false);
          }}
          type={selectedType !== undefined ? selectedType : EntityType.Album}
          onClose={() => setSearchEnabled(false)}
        />
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
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingIconContainer}>
            <LoadingIcon colour={userColour} />
          </div>
        </div>
      )}
    </div>
  );
}
