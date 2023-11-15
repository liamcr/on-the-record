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
import SideNav from "@/components/SideNav/SideNav";
import Search from "@/components/Search/Search";
import { Entity, EntityType } from "@/common/types";

export default function Home() {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 770px)");

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userColour, setUserColour] = useState("#888");

  const [userProvider, setUserProvider] = useState("");
  const [userProviderId, setUserProviderId] = useState(-1);

  // TODO: Change string to `Post`
  const [results, setResults] = useState<string[]>([]);

  const [searchEnabled, setSearchEnabled] = useState(false);

  const onUserSelect = (user: Entity) => {
    if (!user.href) return;

    window.location.href = user.href;
  };

  useEffect(() => {
    const colour = localStorage.getItem("otrColour");
    if (colour !== null) {
      setUserColour(colour);
    }

    StreamingServiceController.handleLogin(window.location);

    StreamingServiceController.getCurrentUser(
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrAccessToken") || ""
    ).then((user) => {
      sessionStorage.setItem("otrStreamingServiceId", user.id);

      APIWrapper.getUser(user.streamingService, user.id).then((otrUser) => {
        setUserProvider(otrUser.data?.provider || "");
        setUserProviderId(otrUser.data?.providerId || -1);

        if (otrUser.error && otrUser.error.code === 404) {
          // User does not exist in our system, redirect to onboarding
          router.push("/onboarding");
          return;
        } else if (otrUser.error) {
          // TODO: Come up with designs for error case
          setIsError(true);
          return;
        }

        setIsLoadingUser(false);
      });
    });
  }, []);

  return (
    <div className={styles.pageContainer}>
      {isLoadingUser ? (
        <div className={styles.loadingIconOuterContainer}>
          <div className={styles.loadingIconInnerContainer}>
            <LoadingIcon colour={userColour} />
          </div>
        </div>
      ) : (
        <>
          {!isMobile && (
            <SideNav
              colour={userColour}
              userProvider={userProvider}
              userProviderId={userProviderId}
            />
          )}
          <main className={styles.main}>
            <Heading component="h1" content="What's New?" />
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
                      window.location.href = "/new/review";
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
                      setSearchEnabled(true);
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
          {isMobile && (
            <BottomNav
              colour={userColour}
              userProvider={userProvider}
              userProviderId={userProviderId}
            />
          )}
          <Search
            type={EntityType.User}
            enabled={searchEnabled}
            onClose={() => setSearchEnabled(false)}
            onSelect={onUserSelect}
          />
        </>
      )}
    </div>
  );
}
