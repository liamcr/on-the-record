"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

import styles from "./page.module.css";
import Heading from "@/components/Heading/Heading";
import { EntityType } from "@/common/types";
import ChipSelect from "@/components/ChipSelect/ChipSelect";
import ButtonBase from "@/components/ButtonBase/ButtonBase";
import Body from "@/components/Body/Body";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import EditableTopFive from "@/components/EditableTopFive/EditableTopFive";
import ColourSelection from "@/components/ColourSelection/ColourSelection";
import { APIWrapper } from "@/common/apiWrapper";
import { StreamingService } from "@/common/streamingServiceFns";

const nameToEntityType = {
  Track: EntityType.Track,
  Album: EntityType.Album,
  Artist: EntityType.Artist,
};

const EntityTypeToName = ["Track", "Album", "Artist"];

export default function NewList() {
  const [selectedType, setSelectedType] = useState<EntityType | undefined>();
  const [userColour, setUserColour] = useState("#888");
  const [listColour, setListColour] = useState("#6471E5");
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<any[]>([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [listTitle, setListTitle] = useState("");
  const [isError, setIsError] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListTitle(e.target.value);
  };

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
    setList([undefined, undefined, undefined, undefined, undefined]);
  };

  const onSubmit = () => {
    setIsLoading(true);
    APIWrapper.createList(
      process.env.API_URL || "",
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrStreamingServiceId") || "",
      selectedType || EntityType.Track,
      listTitle,
      listColour,
      list
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
          <>
            <EditableTopFive
              colour={listColour}
              type={selectedType}
              title={listTitle}
              list={list}
              onTitleChange={onTitleChange}
              onListChange={(updatedList) => {
                setList(updatedList);
              }}
            />
            <ColourSelection
              colours={[
                "#6471E5",
                "#52CB57",
                "#DDA147",
                "#DCD069",
                "#C66FD4",
                "#C67171",
                "#94D1D4",
                "#B1BF56",
              ]}
              onChange={(updatedColour) => {
                setListColour(updatedColour);
              }}
              isListSelection
            />
            <footer className={styles.submitContainer}>
              <ButtonBase
                className={styles.submitButton}
                style={{ backgroundColor: userColour }}
                onClick={onSubmit}
                disabled={!list.every((val) => val !== undefined)}
              >
                <Body className={styles.submitText} content="Submit" />
              </ButtonBase>
            </footer>
          </>
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
