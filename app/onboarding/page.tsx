"use client";

import React, { useState } from "react";
import Heading from "../../components/Heading/Heading";
import ButtonBase from "../../components/ButtonBase/ButtonBase";
import Body from "@/components/Body/Body";
import Search from "@/components/Search/Search";
import { Entity, MusicNote } from "@/common/types";
import Select from "@/components/Select/Select";
import MenuItem from "@mui/material/MenuItem";
import EditableMusicNote from "@/components/EditableMusicNote/EditableMusicNote";
import Name from "./name";
import ImageSection from "./image";
import Colour from "./colour";

import styles from "./page.module.css";
import { APIWrapper } from "@/common/apiWrapper";
import { StreamingService } from "@/common/streamingServiceFns";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { promptTypeMap, prompts } from "@/common/consts";
import { Alert, Snackbar } from "@mui/material";

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
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

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFirstRemoved = () => {
    setFirstPromptIndex(secondPromptIndex);
    setFirstMusicNote(secondMusicNote);
    setSecondPromptIndex("");
    setSecondMusicNote(undefined);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onImageChange = (url: string) => {
    setProfilePicUrl(url);
  };

  const onColourChange = (colour: string) => {
    setColour(colour);
  };

  const buildMusicNotes: () => MusicNote[] = () => {
    if (!firstMusicNote) {
      return [];
    }

    let musicNotes = [
      {
        prompt: prompts[firstPromptIndex as number],
        title: firstMusicNote.title,
        imageSrc: firstMusicNote.imageSrc,
        subtitle: firstMusicNote.subtitle,
      },
    ];

    if (secondMusicNote) {
      musicNotes.push({
        prompt: prompts[secondPromptIndex as number],
        title: secondMusicNote.title,
        imageSrc: secondMusicNote.imageSrc,
        subtitle: secondMusicNote.subtitle,
      });
    }

    return musicNotes;
  };

  const onSubmit = () => {
    if (
      !sessionStorage.getItem("otrStreamingService") ||
      !sessionStorage.getItem("otrStreamingServiceId")
    ) {
      setIsError(true);
      return;
    }

    setIsLoading(true);

    APIWrapper.createUser(
      process.env.NEXT_PUBLIC_API_URL || "",
      (sessionStorage.getItem("otrStreamingService") as StreamingService) ||
        "spotify",
      sessionStorage.getItem("otrStreamingServiceId") || "",
      name,
      colour,
      profilePicUrl,
      buildMusicNotes()
    )
      .then((resp) => {
        if (!resp.error) {
          localStorage.setItem("otrColour", colour);
          // Success!
          if (window) {
            window.location.href = "/home";
          }
          return;
        }

        console.error(resp.error);
        setIsError(true);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          <Name name={name} onChange={onNameChange} colour={colour || ""} />
        </div>
        <div
          className={styles.pageContainer}
          style={{
            left: page === 1 ? "0" : page < 1 ? "100%" : "-100%",
          }}
        >
          <ImageSection
            onChange={onImageChange}
            colour={colour !== "" ? colour : "gray"}
          />
        </div>
        <div
          className={styles.pageContainer}
          style={{
            left: page === 2 ? "0" : page < 2 ? "100%" : "-100%",
          }}
        >
          <Colour onChange={onColourChange} />
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
        }}
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
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingIconContainer}>
            <LoadingIcon colour={colour || "gray"} />
          </div>
        </div>
      )}
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
                onSubmit();
              } else {
                setPage((currentPage) => currentPage + 1);
              }
            }}
          >
            {page >= 3 ? <Body content="Finish" /> : <Body content="Next" />}
          </ButtonBase>
        </div>
      </footer>
    </>
  );
}
