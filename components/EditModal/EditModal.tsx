import { Entity, MusicNote, User } from "@/common/types";
import React, { useState } from "react";
import Heading from "../Heading/Heading";
import ImageUpload from "../ImageUpload/ImageUpload";
import TextField from "../TextField/TextField";
import ColourSelection from "../ColourSelection/ColourSelection";
import EditableMusicNote from "../EditableMusicNote/EditableMusicNote";
import { MenuItem, useMediaQuery } from "@mui/material";
import Select from "../Select/Select";

import styles from "./EditModal.module.css";
import Search from "../Search/Search";
import { promptTypeMap, prompts } from "@/common/consts";
import ButtonBase from "../ButtonBase/ButtonBase";
import Body from "../Body/Body";
import { APIWrapper } from "@/common/apiWrapper";
import LoadingIcon from "../LoadingIcon/LoadingIcon";

interface EditModalProps {
  user: User;
  colour: string;
  onClose?: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ user, colour, onClose }) => {
  const [profilePicUrl, setProfilePicUrl] = useState(user.profilePictureSrc);
  const [name, setName] = useState(user.name);
  const [selectedColour, setSelectedColour] = useState(user.colour);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 770px)");

  const [firstPromptIndex, setFirstPromptIndex] = useState<string | number>(
    user.musicNotes.length < 1
      ? ""
      : prompts.findIndex((val) => val === user.musicNotes[0].prompt)
  );
  const [firstMusicNote, setFirstMusicNote] = useState<Entity | undefined>(
    user.musicNotes.length < 1
      ? undefined
      : {
          imageSrc: user.musicNotes[0].imageSrc,
          title: user.musicNotes[0].title,
          subtitle: user.musicNotes[0].subtitle,
        }
  );
  const [firstOpen, setFirstOpen] = useState(false);

  const [secondPromptIndex, setSecondPromptIndex] = useState<string | number>(
    user.musicNotes.length < 2
      ? ""
      : prompts.findIndex((val) => val === user.musicNotes[1].prompt)
  );
  const [secondMusicNote, setSecondMusicNote] = useState<Entity | undefined>(
    user.musicNotes.length < 2
      ? undefined
      : {
          imageSrc: user.musicNotes[1].imageSrc,
          title: user.musicNotes[1].title,
          subtitle: user.musicNotes[1].subtitle,
        }
  );
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [secondOpen, setSecondOpen] = useState(false);

  const onFirstRemoved = () => {
    setFirstPromptIndex(secondPromptIndex);
    setFirstMusicNote(secondMusicNote);
    setSecondPromptIndex("");
    setSecondMusicNote(undefined);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
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
        id: firstMusicNote.entityId,
      },
    ];

    if (secondMusicNote) {
      musicNotes.push({
        prompt: prompts[secondPromptIndex as number],
        title: secondMusicNote.title,
        imageSrc: secondMusicNote.imageSrc,
        subtitle: secondMusicNote.subtitle,
        id: secondMusicNote.entityId,
      });
    }

    return musicNotes;
  };

  const onSubmit = () => {
    setIsLoading(true);

    APIWrapper.updateUser(
      user.id,
      name,
      selectedColour,
      profilePicUrl,
      buildMusicNotes()
    )
      .then((resp) => {
        if (!resp.error) {
          localStorage.setItem("otrColour", selectedColour);
          // Success!
          window.location.reload();
          return;
        }

        console.error(resp.error);
        setIsError(true);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        if (onClose) {
          onClose();
        }
      }}
    >
      <div className={styles.modal}>
        <Heading
          className={styles.header}
          component="h2"
          content="Edit Profile"
        />
        <div className={styles.editableContent}>
          <Heading
            className={styles.subheading}
            component="h3"
            content="Profile Picture"
          />
          <ImageUpload
            colour={colour}
            onChange={(newUrl) => {
              setProfilePicUrl(newUrl);
            }}
            initialUrl={user.profilePictureSrc}
          />
          <Heading
            className={styles.subheading}
            component="h3"
            content="Name"
          />
          <TextField
            onChange={onNameChange}
            colour={selectedColour}
            value={name}
            variant="filled"
            fullWidth
            label="Name"
            size="large"
            inputProps={{ maxLength: 30, name: "otrName" }}
          />
          <Heading
            className={styles.subheading}
            component="h3"
            content="Colour"
          />
          <ColourSelection
            colours={[
              "#192BC6",
              "#148D19",
              "#AB6E11",
              "#B6A401",
              "#AE1AC5",
              "#CF3939",
              "#1A8D93",
              "#CC0093",
            ]}
            onChange={(newColour) => {
              setSelectedColour(newColour);
            }}
            isListSelection
            style={{
              gap: isMobile ? "0.5rem" : "1rem",
            }}
          />
          <Heading
            className={styles.subheading}
            component="h3"
            content="About You"
          />
          <div className={styles.musicNoteSelectContainer}>
            <div>
              <Select
                label="Select a prompt..."
                colour={colour}
                open={firstOpen}
                onOpen={() => setFirstOpen(true)}
                onClose={() => setFirstOpen(false)}
                onChange={(e) => {
                  setFirstMusicNote(undefined);
                  setFirstPromptIndex(e.target.value as number);
                }}
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
                  onChange={(e) => {
                    setSecondMusicNote(undefined);
                    setSecondPromptIndex(e.target.value as number);
                  }}
                  value={secondPromptIndex}
                >
                  {prompts.map(
                    (prompt, i) =>
                      i !== firstPromptIndex && (
                        <MenuItem value={i} key={i}>
                          {prompt}
                        </MenuItem>
                      )
                  )}
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
        </div>
        <div className={styles.modalFooter}>
          <ButtonBase
            className={styles.submitButton}
            style={{ backgroundColor: selectedColour }}
            onClick={onSubmit}
          >
            <Body className={styles.submitText} content="Save" />
          </ButtonBase>
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
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingIconContainer}>
              <LoadingIcon colour={selectedColour} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;
