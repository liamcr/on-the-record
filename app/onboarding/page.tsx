import React from "react";

import styles from "./page.module.css";
import Heading from "../../components/Heading/Heading";

export default function Onboarding() {
  return (
    <div className={styles.pageContainer}>
      <Heading component="h1" content="Welcome" />
      <Heading
        component="h2"
        content="Welcome to On The Record! Let's get you set up."
      />
      <Heading component="h2" content="What's your name?" />
    </div>
  );
}
