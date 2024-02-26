import styles from "./page.module.css";
import Logo from "../components/Logo/Logo";
import Body from "../components/Body/Body";

export default function Home() {
  return (
    <>
      <div className={styles.outerBackdrop}></div>
      <div className={styles.innerBackdrop}>
        <Logo />
        <div className={styles.buttons}>
          <a
            href="/api/auth/login"
            className={`${styles.loginButton} ${styles.button}`}
          >
            <Body className={styles.loginText} content="Login" />
          </a>
        </div>
      </div>
    </>
  );
}
