import React, { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./Search.module.css";
import { Entity, EntityType, UserCondensed } from "@/common/types";
import { debounce } from "@/common/functions";
import {
  StreamingService,
  StreamingServiceController,
} from "@/common/streamingServiceFns";
import Body from "../Body/Body";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import DefaultProfile from "../../public/defaultProfile.png";
import { APIWrapper } from "@/common/apiWrapper";

interface SearchProps {
  enabled: boolean;
  type: EntityType;
  onSelect: (arg0: Entity) => void;
  onClose?: () => void;
}

const entityTypeNames = ["Track", "Album", "Artist", "User"];

const Search: React.FC<SearchProps> = ({
  enabled,
  type,
  onSelect,
  onClose,
}) => {
  const [featuredUsers, setFeaturedUsers] = useState<UserCondensed[]>([]);
  const [showFeaturedUsers, setShowFeaturedUsers] = useState(
    type === EntityType.User
  );
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState<Entity[]>([]);
  const [isError, setIsError] = useState(false);

  const onSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value === "") {
      setShowFeaturedUsers(type === EntityType.User);
      setResults([]);
      return;
    }
    setShowFeaturedUsers(false);
    if (type === EntityType.User) {
      APIWrapper.searchUsers(event.target.value).then((resp) => {
        if (!resp.data) {
          // TODO, handle error
          return;
        }
        setResults(resp.data);

        if (resp.data.length === 0 && event.target.value.length !== 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      });
    } else {
      StreamingServiceController.search(
        sessionStorage.getItem("otrStreamingService") as StreamingService,
        sessionStorage.getItem("otrAccessToken") || "",
        event.target.value,
        entityTypeNames[type].toLowerCase()
      ).then((resp) => {
        setResults(resp);

        if (resp.length === 0 && event.target.value.length !== 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      });
    }
  };

  useEffect(() => {
    if (type === EntityType.User) {
      APIWrapper.getFeaturedUsers().then((resp) => {
        if (resp.data) {
          setFeaturedUsers(resp.data);
        }
      });
    }
  }, [setFeaturedUsers]);

  return (
    enabled && (
      <div
        className={styles.searchOverlay}
        onClick={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }

          if (onClose) {
            setResults([]);
            setNoResults(false);
            onClose();
          }
        }}
      >
        <div className={styles.searchBar}>
          <SearchIcon />
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: "rgb(var(--foreground-rgb))",
              fontSize: "var(--input-font-size)",
            }}
            autoFocus
            placeholder={`Search ${entityTypeNames[type]}s...`}
            inputProps={{
              "aria-label": `search ${entityTypeNames[type].toLowerCase()}s`,
            }}
            onChange={debounce(onSearchChange, 300)}
          />
        </div>
        <div className={styles.resultsContainer}>
          {showFeaturedUsers && (
            <div className={styles.featured}>
              <Body className={styles.featuredText} content="Featured Users" />
              {featuredUsers.map((featuredUser, i) => (
                <a
                  key={i}
                  className={styles.result}
                  href={`/profile/${featuredUser.provider}/${featuredUser.providerId}`}
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={
                        featuredUser.profilePictureSrc !== "/"
                          ? featuredUser.profilePictureSrc
                          : DefaultProfile.src
                      }
                      fill
                      alt={featuredUser.name}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.titlesContainer}>
                    <Body
                      content={featuredUser.name}
                      className={styles.title}
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
          {noResults ? (
            <div className={styles.noResults}>
              <Body className={styles.crickets} content="🦗 🦗 🦗" />
              <Body
                className={styles.noResultsText}
                content="There's nothing here..."
              />
            </div>
          ) : (
            results.map((entity, i) => (
              <div
                key={i}
                className={styles.result}
                onClick={() => {
                  onSelect(entity);
                  setResults([]);
                }}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={
                      entity.imageSrc !== "/"
                        ? entity.imageSrc
                        : DefaultProfile.src
                    }
                    fill
                    alt={entity.title}
                    className={styles.image}
                  />
                </div>
                <div className={styles.titlesContainer}>
                  <Body content={entity.title} className={styles.title} />
                  {entity.subtitle && entity.subtitle !== "" && (
                    <Body
                      content={entity.subtitle}
                      className={styles.subtitle}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={() => setIsError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setIsError(false)} severity="error">
            Something went wrong
          </Alert>
        </Snackbar>
      </div>
    )
  );
};

export default Search;
