"use client";

import React, { useState } from "react";

import styles from "./page.module.css";
import Heading from "../../components/Heading/Heading";
import ButtonBase from "../../components/ButtonBase/ButtonBase";
import Body from "@/components/Body/Body";
import TextField from "@/components/TextField/TextField";
import ColourSelection from "@/components/ColourSelection/ColourSelection";
import Search from "@/components/Search/Search";
import { Entity, EntityType, MusicNote } from "@/common/types";
import Select from "@/components/Select/Select";
import MenuItem from "@mui/material/MenuItem";
import EditableMusicNote from "@/components/EditableMusicNote/EditableMusicNote";

const prompts = [
  "My Favourite Artist",
  "My Favourite Album",
  "My Favourite Song",
  "The Song I Last Cried To",
  "The Best Song To Play During A Workout",
];

const promptTypeMap = [
  EntityType.Artist,
  EntityType.Album,
  EntityType.Track,
  EntityType.Track,
  EntityType.Track,
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);

  const [firstPromptIndex, setFirstPromptIndex] = useState<string | number>("");
  const [firstMusicNote, setFirstMusicNote] = useState<Entity | undefined>();
  const [firstOpen, setFirstOpen] = useState(false);

  const [secondPromptIndex, setSecondPromptIndex] = useState<string | number>(
    ""
  );
  const [secondMusicNote, setSecondMusicNote] = useState<Entity | undefined>();
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [secondOpen, setSecondOpen] = useState(false);

  const onFirstRemoved = () => {
    setFirstPromptIndex(secondPromptIndex);
    setFirstMusicNote(secondMusicNote);
    setSecondPromptIndex("");
    setSecondMusicNote(undefined);
  };

  return (
    <>
      <div>
        <div
          className={styles.pageContainer}
          style={{
            left: page === 0 ? "0" : "-100%",
          }}
        >
          <div className={styles.onboardingContainer}>
            <Heading
              component="h1"
              content="Welcome"
              className={styles.titleBase}
            />
            <Heading
              component="h2"
              content="Welcome to On The Record! Let's get you set up."
              className={styles.subtitleBase}
            />
            <Heading
              component="h2"
              content="What's your name?"
              className={styles.subtitleBase}
            />
            <TextField
              colour={colour === "" ? "rgb(var(--foreground-rgb))" : colour}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
              variant="filled"
              fullWidth
              label="Name"
              value={name}
              size="large"
              inputProps={{ maxLength: 30, name: "otrName" }}
            />
          </div>
        </div>
        <div
          className={styles.pageContainer}
          style={{
            left: page === 1 ? "0" : page < 1 ? "100%" : "-100%",
          }}
        >
          <div className={styles.onboardingContainer}>
            <Heading
              component="h1"
              content="Upload a Profile Pic"
              className={styles.titleBase}
            />
            <Heading
              component="h2"
              content="This is optional and can be changed at any time."
              className={styles.subtitleBase}
            />
          </div>
        </div>
        <div
          className={styles.pageContainer}
          style={{
            left: page === 2 ? "0" : page < 2 ? "100%" : "-100%",
          }}
        >
          <div className={styles.onboardingContainer}>
            <Heading
              component="h1"
              content="A Couple More Things"
              className={styles.titleBase}
            />
            <Heading
              component="h2"
              content="What's your favourite colour?"
              className={styles.subtitleBase}
            />
            <ColourSelection
              colours={[
                "#1A2EE3",
                "#148D19",
                "#F6A120",
                "#CC1BE9",
                "#E23A3A",
                "#E2CF23",
              ]}
              onChange={setColour}
            />
            <div style={{ height: "10vh" }} />
          </div>
        </div>
        <div
          className={styles.pageContainer}
          style={{
            left: page === 3 ? "0" : page < 3 ? "100%" : "-100%",
          }}
        >
          <div className={styles.onboardingContainer}>
            <Heading
              component="h1"
              content="Almost Done"
              className={styles.titleBase}
            />
            <Heading
              component="h2"
              content="The people want to know your music opinions! Add some here."
              className={styles.subtitleBase}
            />
            <div className={styles.musicNoteSelectContainer}>
              <div>
                <Select
                  label="Select a prompt..."
                  colour={colour}
                  open={firstOpen}
                  onOpen={() => setFirstOpen(true)}
                  onClose={() => setFirstOpen(false)}
                  onChange={(e) =>
                    setFirstPromptIndex(e.target.value as number)
                  }
                  value={firstPromptIndex}
                >
                  {prompts.map((prompt, i) => (
                    <MenuItem value={i} key={i}>
                      {prompt}
                    </MenuItem>
                  ))}
                </Select>
                {firstPromptIndex !== "" && (
                  <EditableMusicNote
                    entity={firstMusicNote}
                    onSelect={() => {
                      setSelectedPrompt(0);
                      setSearchEnabled(true);
                    }}
                    onRemove={onFirstRemoved}
                  />
                )}
              </div>
              <div>
                {firstMusicNote && (
                  <Select
                    label="Select another prompt..."
                    colour={colour}
                    open={secondOpen}
                    onOpen={() => setSecondOpen(true)}
                    onClose={() => setSecondOpen(false)}
                    onChange={(e) =>
                      setSecondPromptIndex(e.target.value as number)
                    }
                    value={secondPromptIndex}
                  >
                    {prompts.map((prompt, i) => (
                      <MenuItem value={i} key={i}>
                        {prompt}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {secondPromptIndex !== "" && (
                  <EditableMusicNote
                    entity={secondMusicNote}
                    onSelect={() => {
                      setSelectedPrompt(1);
                      setSearchEnabled(true);
                    }}
                    onRemove={() => {
                      setSecondMusicNote(undefined);
                      setSecondPromptIndex("");
                    }}
                  />
                )}
              </div>
            </div>
            <div style={{ height: "10vh" }} />
          </div>
        </div>
      </div>
      <Search
        enabled={searchEnabled}
        type={
          promptTypeMap[
            selectedPrompt === 0
              ? (firstPromptIndex as number)
              : (secondPromptIndex as number)
          ]
        }
        onSelect={(entity) => {
          setSearchEnabled(false);
          if (selectedPrompt === 0) {
            setFirstMusicNote(entity);
          } else if (selectedPrompt === 1) {
            setSecondMusicNote(entity);
          }
          setSearchEnabled(false);
        }}
        onClose={() => setSearchEnabled(false)}
      />
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          {page > 0 && (
            <ButtonBase
              disabled={page === 0 && name === ""}
              className={styles.footerBackButton}
              style={{
                backgroundColor: "rgb(var(--foreground-rgb))",
                color: "rgb(var(--background-rgb))",
              }}
              onClick={() => {
                if (page <= 0) {
                  // Shouldn't be visible
                  return;
                }

                setPage((currentPage) => currentPage - 1);
              }}
            >
              <Body content="Back" />
            </ButtonBase>
          )}
          <div>
            {[0, 1, 2, 3].map((val) => (
              <button
                className={styles.footerDot}
                onClick={() => {
                  setPage(val);
                }}
                disabled={page <= val}
                key={val}
                style={{
                  backgroundColor:
                    page === val ? "rgb(var(--foreground-rgb))" : "transparent",
                }}
              />
            ))}
          </div>
          <ButtonBase
            disabled={
              (page === 0 && name === "") || (page === 2 && colour === "")
            }
            className={styles.footerButton}
            style={{
              backgroundColor:
                colour === "" ? "rgb(var(--foreground-rgb))" : colour,
              color: colour === "" ? "rgb(var(--background-rgb))" : "#fff",
            }}
            onClick={() => {
              if (page >= 3) {
                // Add user
                return;
              }

              setPage((currentPage) => currentPage + 1);
            }}
          >
            {page >= 3 ? <Body content="Finish" /> : <Body content="Next" />}
          </ButtonBase>
        </div>
      </footer>
    </>
  );
}
