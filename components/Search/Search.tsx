import React, { useState } from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
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

interface SearchProps {
  enabled: boolean;
  type: EntityType;
  onSelect: (arg0: Entity) => void;
  onClose?: () => void;
}

const entityTypeNames = ["Track", "Album", "Artist"];

const Search: React.FC<SearchProps> = ({
  enabled,
  type,
  onSelect,
  onClose,
}) => {
  const [results, setResults] = useState<Entity[]>([]);

  const onSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value === "") {
      setResults([]);
      return;
    }
    StreamingServiceController.search(
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrAccessToken") || "",
      event.target.value,
      entityTypeNames[type].toLowerCase()
    ).then((resp) => {
      setResults(resp);
    });
  };

  return (
    enabled && (
      <div
        className={styles.searchOverlay}
        onClick={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }

          onClose && onClose();
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
            placeholder={`Search ${entityTypeNames[type]}s...`}
            inputProps={{
              "aria-label": `search ${entityTypeNames[type].toLowerCase()}s`,
            }}
            onChange={debounce(onSearchChange, 300)}
          />
        </div>
        <div className={styles.resultsContainer}>
          {results.map((entity, i) => (
            <div key={i} className={styles.result}>
              <div className={styles.imageContainer}>
                <Image
                  src={entity.imageSrc}
                  fill
                  alt={entity.title}
                  className={styles.image}
                />
              </div>
              <div className={styles.titlesContainer}>
                <Body content={entity.title} className={styles.title} />
                {entity.subtitle && entity.subtitle !== "" && (
                  <Body content={entity.subtitle} className={styles.subtitle} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Search;
