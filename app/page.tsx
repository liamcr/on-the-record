import styles from "./page.module.css";
import Logo from "../components/Logo/Logo";
import Body from "../components/Body/Body";
import ButtonBase from "../components/ButtonBase/ButtonBase";
import Image from "next/image";

import Spotify from "../public/spotify.svg";
import AppleMusic from "../public/appleMusic.svg";
import AmazonMusic from "../public/amazonMusic.svg";

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
          <ButtonBase
            style={{
              backgroundColor: "#1DB954",
              width: "100%",
              marginBlock: "1.5rem",
            }}
          >
            <div className={styles.logoContainer}>
              <Image src={Spotify} alt="Spotify Logo" fill />
            </div>
            <Body className={styles.spotifyText} content="Spotify" />
          </ButtonBase>
          <ButtonBase
            style={{
              backgroundColor: "#fb435b",
              width: "100%",
              marginBlock: "1.5rem",
            }}
          >
            <div className={styles.logoContainer}>
              <Image src={AppleMusic} alt="Apple Music Logo" fill />
            </div>
            <Body className={styles.appleMusicText} content="Apple Music" />
          </ButtonBase>
          <ButtonBase
            style={{
              backgroundColor: "#1b9ba1",
              width: "100%",
              marginBlock: "1.5rem",
            }}
          >
            <div className={styles.logoContainer}>
              <Image src={AmazonMusic} alt="Amazon Music Logo" fill />
            </div>
            <Body className={styles.amazonMusicText} content="Amazon Music" />
          </ButtonBase>
        </div>
        {/* Logo
    Login With...
    Spotify
    Apple
    Amazon */}
      </div>
    </>
  );
}
