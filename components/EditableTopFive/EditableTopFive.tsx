import { EntityType, ListElement, TopFiveList } from "../../common/types";
import React, { useState } from "react";

import styles from "./EditableTopFive.module.css";
import Image from "next/image";
import Heading from "../Heading/Heading";
import TextField from "../TextField/TextField";
import Search from "../Search/Search";

interface EditableTopFiveProps {
  type: EntityType;
  colour: string;
  /**
   * Callback to run whenever there is a change to the list
   * @param arg0 The title of the list
   * @param arg1 The list of elements
   * @returns
   */
  onChange: (arg0: string, arg1: ListElement[]) => void;
}

const EditableTopFive: React.FC<EditableTopFiveProps> = ({
  type,
  colour,
  onChange,
}) => {
  const [list, setList] = useState<any[]>([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [title, setTitle] = useState("");

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className={styles.listContainer} style={{ backgroundColor: colour }}>
      <div className={styles.titleHeader} aria-autocomplete="none">
        <Heading component="h3" content="Top 5" className={styles.listTitle} />
        <div className={styles.titleInputContainer}>
          <TextField
            colour="#000"
            isTopFive={true}
            value={title}
            onChange={onTitleChange}
            variant="outlined"
            placeholder="...Title"
            id="list-title"
            defaultValue="Hello world"
          />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={styles.listElement}
          onClick={() => {
            setSelectedIndex(i);
            setSearchEnabled(true);
          }}
        >
          {list[i] === undefined && <div>Undefined</div>}
          {list[i] !== undefined && (
            <div>
              <Heading
                component="h4"
                content={`${i + 1}.`}
                className={styles.listElementIndex}
              />
              <div className={styles.listElementImageContainer}>
                <Image
                  src={list[i].src}
                  alt={list[i].name}
                  fill
                  className={styles.listElementImage}
                />
              </div>
              <Heading
                component="h4"
                content={list[i].name}
                className={styles.listElementName}
              />
            </div>
          )}
        </div>
      ))}
      <Search
        enabled={searchEnabled}
        onSelect={(selectedEntity) => {
          setList((prevList) => {
            prevList[selectedIndex] = {
              name: selectedEntity.title,
              src: selectedEntity.imageSrc,
            };

            return prevList;
          });
          setSearchEnabled(false);
        }}
        type={type !== undefined ? type : EntityType.Album}
        onClose={() => setSearchEnabled(false)}
      />
    </div>
  );
};

export default EditableTopFive;
