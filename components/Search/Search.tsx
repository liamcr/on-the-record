import React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./Search.module.css";
import { Entity, EntityType } from "@/common/types";

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
          />
        </div>
      </div>
    )
  );
};

export default Search;
