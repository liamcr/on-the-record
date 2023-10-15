"use client";

import React, { useState } from "react";

import styles from "./page.module.css";
import Heading from "../../components/Heading/Heading";
import ButtonBase from "../../components/ButtonBase/ButtonBase";
import { User } from "../../common/types";
import Body from "../../components/Body/Body";
import TextField from "@/components/TextField/TextField";

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");

  return (
    <>
      <div className={styles.pageContainer}>
        {page === 0 && (
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
        )}
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div>
            {[0, 1, 2, 3].map((val) => (
              <button
                className={styles.footerDot}
                onClick={() => {
                  setPage(val);
                }}
                key={val}
                style={{
                  backgroundColor:
                    page === val ? "rgb(var(--foreground-rgb))" : "transparent",
                }}
              />
            ))}
          </div>
          <ButtonBase
            disabled={name === ""}
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
