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

interface SearchProps {
  enabled: boolean;
  type: EntityType;
  onSelect: (arg0: Entity) => void;
  onClose?: () => void;
}

const EntityTypeNames = ["Track", "Album", "Artist"];

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
    let log = StreamingServiceController.search(
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrAccessToken") || "",
      event.target.value
    );
    console.log(log);
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
            placeholder={`Search ${EntityTypeNames[type]}s...`}
            inputProps={{
              "aria-label": `search ${EntityTypeNames[type].toLowerCase()}s`,
            }}
            onChange={debounce(onSearchChange, 300)}
          />
        </div>
      </div>
    )
  );
};

export default Search;
