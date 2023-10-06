import styles from "./page.module.css";
import Logo from "../components/Logo/Logo";
import Body from "../components/Body/Body";
import ButtonBase from "../components/ButtonBase/ButtonBase";
import Image from "next/image";

import Spotify from "../public/spotify.svg";
import AppleMusic from "../public/appleMusic.svg";
import AmazonMusic from "../public/amazonMusic.svg";
import Link from "next/link";
import { StreamingServiceController } from "../common/streamingServiceFns";

export default function Home() {
  return (
    <>
      <div className={styles.outerBackdrop}></div>
      <div className={styles.innerBackdrop}>
        <Logo />
        <div className={styles.loginTextContainer}>
          <div className={styles.horizontalSpacer} />
          <Body className={styles.loginWith} content="Login with" />
          <div className={styles.horizontalSpacer} />
        </div>
        <div className={styles.buttons}>
          <Link
            href={StreamingServiceController.buildAuthenticationUri(
              "spotify",
              process.env.SPOTIFY_CLIENT_ID || "",
              process.env.REDIRECT_URI || "",
              ["user-read-private", "user-read-email"]
            )}
            className={`${styles.button} ${styles.spotifyButton}`}
          >
            <div className={styles.logoContainer}>
              <Image src={Spotify} alt="Spotify Logo" fill />
            </div>
            <Body className={styles.spotifyText} content="Spotify" />
          </Link>
          <Link
            href={StreamingServiceController.buildAuthenticationUri(
              "appleMusic",
              "",
              "",
              []
            )}
            className={`${styles.button} ${styles.appleMusicButton}`}
          >
            <div className={styles.logoContainer}>
              <Image src={AppleMusic} alt="Apple Music Logo" fill />
            </div>
            <Body className={styles.appleMusicText} content="Apple Music" />
          </Link>
          <Link
            href={StreamingServiceController.buildAuthenticationUri(
              "amazonMusic",
              "",
              "",
              []
            )}
            className={`${styles.button} ${styles.amazonMusicButton}`}
          >
            <div className={styles.logoContainer}>
              <Image src={AmazonMusic} alt="Amazon Music Logo" fill />
            </div>
            <Body className={styles.amazonMusicText} content="Amazon Music" />
          </Link>
        </div>
      </div>
    </>
  );
}
