"use client";

import React, { useState } from "react";

import styles from "./page.module.css";
import Heading from "../../components/Heading/Heading";
import ButtonBase from "../../components/ButtonBase/ButtonBase";
import Body from "@/components/Body/Body";
import TextField from "@/components/TextField/TextField";
import ColourSelection from "@/components/ColourSelection/ColourSelection";

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");

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
              content="The people want to know your music opinions! Add two of them here."
              className={styles.subtitleBase}
            />
          </div>
        </div>
      </div>
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
            disabled={page === 0 && name === ""}
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
