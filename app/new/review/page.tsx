"use client";

import React, { useState } from "react";

import styles from "./page.module.css";
import Heading from "@/components/Heading/Heading";
import EditableMusicNote from "@/components/EditableMusicNote/EditableMusicNote";
import { Entity, EntityType } from "@/common/types";
import Search from "@/components/Search/Search";
import ReviewScore from "@/components/ReviewScore/ReviewScore";
import TextField from "@/components/TextField/TextField";
import ChipSelect from "@/components/ChipSelect/ChipSelect";

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

  const onBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };
  const onChipChange = (newValue: string) => {
    if (newValue !== "Track" && newValue !== "Album") {
      return;
    }
    setSelectedType(nameToEntityType[newValue]);
  };

  return (
    <div className={styles.outerPageContainer}>
      <div className={styles.pageContainer}>
        <Heading component="h1" content="New Review" />
        <Heading component="h2" content="What Are You Reviewing?" />
        <ChipSelect
          options={["Track", "Album"]}
          selectedColour="#888888"
          onChange={onChipChange}
          selected={
            selectedType === undefined
              ? undefined
              : EntityTypeToName[selectedType]
          }
        />
        <Heading component="h2" content="Select Album" />
        <EditableMusicNote
          entity={entity}
          onSelect={() => setSearchEnabled(true)}
          onRemove={() => setEntity(undefined)}
        />
        <Heading component="h2" content="What Rating Would You Give?" />
        <ReviewScore
          editable
          score={score}
          onChange={(updatedScore) => setScore(updatedScore)}
        />
        <Heading component="h2" content="Tell Us More" />
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
          inputProps={{ maxLength: 30, name: "otrName" }}
        />
        <Search
          enabled={searchEnabled}
          onSelect={(selectedEntity) => {
            setEntity(selectedEntity);
            setSearchEnabled(false);
          }}
          type={EntityType.Album}
          onClose={() => setSearchEnabled(false)}
        />
      </div>
    </div>
  );
}
