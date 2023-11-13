"use client";

import {
  StreamingService,
  StreamingServiceController,
} from "../../common/streamingServiceFns";
import { APIWrapper } from "../../common/apiWrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { useMediaQuery } from "@mui/material";

import styles from "./page.module.css";
import BottomNav from "@/components/BottomNav/BottomNav";
import Heading from "@/components/Heading/Heading";
import Body from "@/components/Body/Body";
import SlidingButton from "@/components/SlidingButton/SlidingButton";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Logo from "@/components/Logo/Logo";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 770px)");

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userColour, setUserColour] = useState("#888");

  const [userProvider, setUserProvider] = useState("");
  const [userProviderId, setUserProviderId] = useState(-1);

  // TODO: Change string to `Post`
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const colour = localStorage.getItem("otrColour");
    if (colour !== null) {
      setUserColour(colour);
    }

    StreamingServiceController.handleLogin(window.location);

    StreamingServiceController.getCurrentUser(
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrAccessToken") || ""
    )
      .then((user) => {
        APIWrapper.getUser(user.streamingService, user.id).then((otrUser) => {
          setUserProvider(otrUser.data?.provider || "");
          setUserProviderId(otrUser.data?.providerId || -1);

          if (otrUser.error && otrUser.error.code === 404) {
            // User does not exist in our system, redirect to onboarding
            router.push("/onboarding");
          } else if (otrUser.error) {
            // TODO: Come up with designs for error case
            setIsError(true);
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.pageContainer}>
      {!isMobile && (
        <nav className={styles.sideNav}>
          <div className={styles.logoContainer}>
            <Logo colour={userColour} shortened={true} />
          </div>
          <div className={styles.navButtonsContainer}>
            <Link className={styles.sideNavButton} href={"/"}>
              <HomeOutlinedIcon />
              <Body className={styles.sideNavButtonText} content="Home" />
            </Link>
            <Link
              className={styles.sideNavButton}
              href={`/profile/${userProvider}/${userProviderId}`}
            >
              <PersonOutlinedIcon />
              <Body className={styles.sideNavButtonText} content="Profile" />
            </Link>
            <Link
              className={styles.sideNavButton}
              href={`/profile/${userProvider}/${userProviderId}`}
            >
              <SearchOutlinedIcon />
              <Body className={styles.sideNavButtonText} content="Search" />
            </Link>
            <div className={styles.actionButtons}>
              <Link
                className={styles.largeButton}
                href={"/new/review"}
                style={{
                  backgroundColor: `${userColour}40`,
                }}
              >
                <RateReviewOutlined className={styles.largeButtonIcon} />
              </Link>
              <Link
                className={styles.largeButton}
                href={"/new/list"}
                style={{
                  backgroundColor: `${userColour}40`,
                }}
              >
                <ListOutlinedIcon className={styles.largeButtonIcon} />
              </Link>
            </div>
          </div>
        </nav>
      )}
      <main className={styles.main}>
        <Heading component="h1" content="What's New?" />
        {isLoading && (
          <div className={styles.loadingIconOuterContainer}>
            <div className={styles.loadingIconInnerContainer}>
              <LoadingIcon colour={userColour} />
            </div>
          </div>
        )}
        {results.length === 0 ? (
          <div className={styles.noResultsContainer}>
            <div className={styles.upperNoResults}>
              <Body className={styles.noResultsText} content="🦗🦗🦗" />
              <Body
                className={styles.noResultsText}
                content="There's nothing here..."
              />
            </div>
            <div className={styles.lowerNoResults}>
              <Body
                className={styles.noResultsText}
                content="Write a review for yourself"
              />
              <SlidingButton
                icon={RateReviewOutlined}
                iconSize="1.5rem"
                text="New Review"
                onClick={() => {
                  console.log("Hi");
                }}
                animated={false}
                className={styles.slidingButton}
              />
              <div className={styles.orContainer}>
                <div className={styles.horizontalSpacer} />
                <Body
                  className={`${styles.noResultsText} ${styles.or}`}
                  content="or"
                />
                <div className={styles.horizontalSpacer} />
              </div>
              <Body
                className={styles.noResultsText}
                content="follow your friends"
              />
              <SlidingButton
                icon={SearchOutlinedIcon}
                iconSize="1.5rem"
                text="Search Users"
                onClick={() => {
                  console.log("Hi");
                }}
                animated={false}
                className={styles.slidingButton}
              />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </main>
      {isMobile && <BottomNav colour={userColour} />}
    </div>
  );
}
