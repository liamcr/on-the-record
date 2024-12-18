"use client";

import { APIWrapper } from "../../common/apiWrapper";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";

import styles from "./page.module.css";
import BottomNav from "@/components/BottomNav/BottomNav";
import Heading from "@/components/Heading/Heading";
import Body from "@/components/Body/Body";
import SlidingButton from "@/components/SlidingButton/SlidingButton";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SideNav from "@/components/SideNav/SideNav";
import Search from "@/components/Search/Search";
import { Entity, EntityType, PostType, TimelineResponse } from "@/common/types";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import TopFive from "@/components/TopFive/TopFive";
import { useUser } from "@auth0/nextjs-auth0/client";
import { translateAuth0Id } from "@/common/functions";

const limit = 3;

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 770px)");

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userColour, setUserColour] = useState("#888");

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [results, setResults] = useState<TimelineResponse[]>([]);

  const [searchEnabled, setSearchEnabled] = useState(false);

  const observer = useRef<IntersectionObserver>(undefined);

  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingTimeline || typeof window === "undefined") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + limit);
        }
      });
      if (node) observer.current.observe(node);
    },
    [observer, isLoadingTimeline, hasMore]
  );

  const onUserSelect = (user: Entity) => {
    if (!user.href) return;

    window.location.href = user.href;
  };

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      // User session most likely expired, redirect to landing page
      router.push("/");
      return;
    }
    if (!user?.sub) {
      return;
    }

    const colour = localStorage.getItem("otrColour");
    if (colour !== null) {
      setUserColour(colour);
    }

    APIWrapper.getUser(translateAuth0Id(user.sub))
      .then((otrUser) => {
        if (otrUser.data?.colour) {
          setUserColour(otrUser.data.colour);
          localStorage.setItem("otrColour", otrUser.data.colour);
        }

        if (otrUser.error && otrUser.error.code === 404) {
          // User does not exist in our system, redirect to onboarding
          router.push("/onboarding");
          return;
        } else if (otrUser.error) {
          setIsError(true);
          return;
        }

        setIsLoadingUser(false);
      })
      .catch((err) => {
        console.error(err);

        setIsError(true);
      });
  }, [isLoading, error, user, router]);

  useEffect(() => {
    if (!user?.sub) {
      return;
    }

    let isMounted = true;
    setIsLoadingTimeline(true);
    APIWrapper.getTimeline(translateAuth0Id(user.sub), offset, limit)
      .then((timelineResp) => {
        if (isMounted) {
          if (timelineResp.error) {
            setIsError(true);
            return;
          }

          setResults((prevResults) =>
            timelineResp.data === undefined
              ? prevResults
              : [...prevResults, ...timelineResp.data]
          );

          if (timelineResp.data && timelineResp.data.length < limit) {
            setHasMore(false);
          }
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingTimeline(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, offset, setHasMore, setIsLoadingTimeline, setResults]);

  return (
    <div className={styles.pageContainer}>
      {isLoadingUser || isLoading ? (
        <div className={styles.loadingIconOuterContainer}>
          <div className={styles.loadingIconInnerContainer}>
            <LoadingIcon colour={userColour} />
          </div>
        </div>
      ) : (
        <>
          {!isMobile && (
            <SideNav colour={userColour} userId={translateAuth0Id(user?.sub)} />
          )}
          <main className={styles.main}>
            <Heading
              component="h1"
              className={styles.whatsNewHeader}
              content="What's New?"
            />
            {results.length === 0 && !isLoadingTimeline ? (
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
                    className={styles.slidingButton}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.timelineContainer}>
                {results.map((result) =>
                  result.type === PostType.Review ? (
                    <ReviewCard
                      key={result.data.id}
                      author={result.author}
                      id={result.data.id}
                      entityId={result.data.entityId}
                      score={result.data.score}
                      src={result.data.imageSrc}
                      subtitle={result.data.subtitle}
                      timestamp={result.timestamp}
                      title={result.data.title}
                      type={result.data.type}
                      colour={result.data.colour}
                      review={result.data.body}
                      belongsToCurrentUser={
                        translateAuth0Id(user?.sub) === result.author.id
                      }
                      userColour={userColour}
                      numLikes={result.numLikes}
                      hasUserLiked={result.isLiked}
                      userId={translateAuth0Id(user?.sub)}
                    />
                  ) : (
                    <TopFive
                      key={result.data.id}
                      author={result.author}
                      id={result.data.id}
                      colour={result.data.colour}
                      timestamp={result.timestamp}
                      title={result.data.title}
                      type={result.data.type}
                      list={result.data.listElements}
                      belongsToCurrentUser={
                        translateAuth0Id(user?.sub) === result.author.id
                      }
                      userColour={userColour}
                      numLikes={result.numLikes}
                      hasUserLiked={result.isLiked}
                      userId={translateAuth0Id(user?.sub)}
                    />
                  )
                )}
                {hasMore && (
                  <div
                    className={styles.loadingIconTimelineOuterContainer}
                    ref={bottomRef}
                  >
                    <div className={styles.loadingIconTimelineInnerContainer}>
                      <LoadingIcon colour={userColour} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
          {isMobile && (
            <BottomNav
              colour={userColour}
              userId={translateAuth0Id(user?.sub)}
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
      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={() => setIsError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setIsError(false)} severity="error">
          Something went wrong... Please try again later.
        </Alert>
      </Snackbar>
    </div>
  );
}
