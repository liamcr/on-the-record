import React, { useState } from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./Search.module.css";
import { Entity, EntityType } from "@/common/types";
import { debounce } from "@/common/functions";
import {
  StreamingService,
  StreamingServiceController,
} from "@/common/streamingServiceFns";
import Body from "../Body/Body";
import Image from "next/image";

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
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState<Entity[]>([]);

  const onSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value === "") {
      setResults([]);
      return;
    }
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
      </div>
    )
  );
};

export default Search;
