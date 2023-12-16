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
import EditableTopFive from "@/components/EditableTopFive/EditableTopFive";

const nameToEntityType = {
  Track: EntityType.Track,
  Album: EntityType.Album,
  Artist: EntityType.Artist,
};

const EntityTypeToName = ["Track", "Album", "Artist"];

export default function NewReview() {
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
  }, [selectedType]);

  const onChipChange = (newValue: string) => {
    if (newValue !== "Track" && newValue !== "Album" && newValue !== "Artist") {
      return;
    }
    pageRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
    setSelectedType(nameToEntityType[newValue]);
  };

  const onSubmit = () => {
    setIsLoading(true);
  };

  return (
    <div className={styles.outerPageContainer}>
      <div className={styles.pageContainer} ref={pageRef}>
        <Heading component="h1" content="New List" />
        <Heading
          component="h2"
          content="What Are You Listing?"
          className={styles.subheading}
        />
        <ChipSelect
          options={["Track", "Album", "Artist"]}
          selectedColour={userColour}
          onChange={onChipChange}
          selected={
            selectedType === undefined
              ? undefined
              : EntityTypeToName[selectedType]
          }
        />
        {selectedType !== undefined && (
          <EditableTopFive
            colour="#ff0000"
            type={selectedType}
            onChange={() => {}}
          />
        )}
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
