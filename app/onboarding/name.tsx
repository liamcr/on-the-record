import React from "react";

import styles from "./page.module.css";
import Heading from "@/components/Heading/Heading";
import TextField from "@/components/TextField/TextField";

interface NameProps {
  /**
   * The current value of the name of the user.
   */
  name: string;
  /**
   * The function to call whenever the value of the name has changed.
   * @param arg0 The updated name of the user
   * @returns
   */
  onChange: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * The user's selected colour.
   */
  colour?: string;
}

const Name: React.FC<NameProps> = ({
  name,
  onChange,
  colour = "rgb(var(--foreground-rgb))",
}) => {
  return (
    <div className={styles.onboardingContainer}>
      <Heading component="h1" content="Welcome" className={styles.titleBase} />
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
        colour={colour}
        onChange={onChange}
        variant="filled"
        fullWidth
        label="Name"
        value={name}
        size="large"
        inputProps={{ maxLength: 30, name: "otrName" }}
      />
    </div>
  );
};

export default Name;
