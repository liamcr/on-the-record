"use client";

import { APIWrapper } from "../../../common/apiWrapper";
import { useCallback, useEffect, useMemo, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";

import styles from "./page.module.css";
import BottomNav from "@/components/BottomNav/BottomNav";
import SideNav from "@/components/SideNav/SideNav";
import { PostType, TimelineResponse, User } from "@/common/types";
import Image from "next/image";
import Heading from "@/components/Heading/Heading";
import Body from "@/components/Body/Body";
import MusicNote from "@/components/MusicNote/MusicNote";
import TopFive from "@/components/TopFive/TopFive";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditModal from "@/components/EditModal/EditModal";
import { useUser } from "@auth0/nextjs-auth0/client";
import { translateAuth0Id } from "@/common/functions";

const limit = 3;

export default function Profile(props: { params: Promise<{ userId: string }> }) {
  const params = use(props.params);
  const { user: auth0User, error, isLoading } = useUser();
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 770px)");
  const isSmallLaptop = useMediaQuery("(max-width: 1400px)");

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userColour, setUserColour] = useState("#888");

  const [editModalEnabled, setEditModalEnabled] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [results, setResults] = useState<TimelineResponse[]>([]);

  const [numReviews, setNumReviews] = useState(0);
  const [numLists, setNumLists] = useState(0);

  const [numFollowers, setNumFollowers] = useState(0);

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

  const isCurrentUser = useMemo(() => {
    return translateAuth0Id(auth0User?.sub) === params.userId;
  }, [auth0User, params.userId]);

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      // User session most likely expired, redirect to landing page
      router.push("/");
      return;
    }
    if (!auth0User?.sub) {
      return;
    }
    if (user !== null) {
      return;
    }

    const colour = localStorage.getItem("otrColour");
    if (colour !== null) {
      setUserColour(colour);
    }

    APIWrapper.getUser(translateAuth0Id(auth0User.sub))
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

        APIWrapper.getUser(params.userId, translateAuth0Id(auth0User.sub)).then(
          (specifiedUser) => {
            if (specifiedUser.error || specifiedUser.data === undefined) {
              // TODO: Come up with designs for error case
              setIsError(true);
              return;
            }

            setUser(specifiedUser.data);
            if (specifiedUser.data.isFollowing !== undefined) {
              setIsFollowing(specifiedUser.data.isFollowing);
            }
            setNumFollowers(specifiedUser.data.followers || 0);
            setNumReviews(specifiedUser.data.reviews || 0);
            setNumLists(specifiedUser.data.lists || 0);
            setIsLoadingUser(false);
          }
        );
      })
      .catch((err) => {
        console.error(err);

        setIsError(true);
      });
  }, [isLoading, error, user, router]);

  useEffect(() => {
    if (!auth0User?.sub) {
      return;
    }
    let isMounted = true;
    setIsLoadingTimeline(true);
    APIWrapper.getUserPosts(
      params.userId,
      translateAuth0Id(auth0User?.sub),
      offset,
      limit
    )
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
  }, [offset, setHasMore, setIsLoadingTimeline, setResults, user]);

  const onFollowClick = () => {
    setIsLoadingFollow(true);
    if (!isFollowing) {
      setIsFollowing(true);
      setNumFollowers((prevVal) => prevVal + 1);
      APIWrapper.followUser(params.userId)
        .catch(() => {
          setIsFollowing(false);
          setNumFollowers((prevVal) => prevVal - 1);
          setIsError(true);
        })
        .finally(() => {
          setIsLoadingFollow(false);
        });
    } else {
      setIsFollowing(false);
      setNumFollowers((prevVal) => prevVal - 1);
      APIWrapper.unfollowUser(params.userId)
        .catch(() => {
          setIsFollowing(true);
          setNumFollowers((prevVal) => prevVal + 1);
          setIsError(true);
        })
        .finally(() => {
          setIsLoadingFollow(false);
        });
    }
  };

  return (
    <div
      className={`${styles.pageContainer} ${
        editModalEnabled ? styles.modalOpen : ""
      }`}
    >
      {isLoadingUser || isLoading ? (
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
              userId={translateAuth0Id(auth0User?.sub)}
            />
          )}
          <main className={styles.main}>
            {user !== null && (
              <>
                <div className={styles.mainContent}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profilePicContainer}>
                      <Image
                        src={user.profilePictureSrc}
                        alt={user.name}
                        className={styles.profilePic}
                        fill
                      />
                    </div>
                    <div className={styles.profileData}>
                      <div className={styles.profileDataText}>
                        <Heading
                          component="h1"
                          content={user.name}
                          className={styles.profileName}
                        />
                        <Body
                          content={`Joined ${new Date(
                            user.createdOn
                          ).getFullYear()}`}
                          className={styles.profileDate}
                        />
                      </div>
                      <button
                        className={styles.followButton}
                        onClick={() => {
                          if (!isCurrentUser) {
                            onFollowClick();
                          } else {
                            setEditModalEnabled(true);
                          }
                        }}
                        disabled={isLoadingFollow}
                        style={{
                          color: `color-mix(in srgb, ${userColour} 70%, white)`,
                        }}
                      >
                        {isCurrentUser && (
                          <EditOutlinedIcon
                            className={styles.followButtonIcon}
                          />
                        )}
                        {!isCurrentUser && isFollowing && (
                          <PersonRemoveOutlinedIcon
                            className={styles.followButtonIcon}
                          />
                        )}
                        {!isCurrentUser && !isFollowing && (
                          <PersonAddOutlinedIcon
                            className={styles.followButtonIcon}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  {isSmallLaptop && (
                    <>
                      <div
                        className={styles.followStatsContainer}
                        style={{
                          backgroundColor: `${userColour}40`,
                        }}
                      >
                        <div className={styles.followStats}>
                          <Heading component="h2" content={`${numFollowers}`} />
                          <Body
                            className={styles.followStatsLabel}
                            content="Followers"
                          />
                        </div>
                        <div className={styles.followStats}>
                          <Heading
                            component="h2"
                            content={`${user.following}`}
                          />
                          <Body
                            className={styles.followStatsLabel}
                            content="Following"
                          />
                        </div>
                      </div>
                      <div className={styles.musicNotes}>
                        {user.musicNotes.map((musicNote, i) => (
                          <MusicNote
                            key={i}
                            prompt={musicNote.prompt}
                            src={musicNote.imageSrc}
                            title={musicNote.title}
                            subtitle={musicNote.subtitle}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div className={styles.activityContainer}>
                    <Heading
                      className={styles.activityHeader}
                      component="h2"
                      content="Activity"
                    />
                    {results.length === 0 && !isLoadingTimeline ? (
                      <div className={styles.noResultsContainer}>
                        <div className={styles.upperNoResults}>
                          <Body
                            className={styles.noResultsText}
                            content="🦗🦗🦗"
                          />
                          <Body
                            className={styles.noResultsText}
                            content="There's nothing here..."
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
                              belongsToCurrentUser={isCurrentUser}
                              userColour={userColour}
                              numLikes={result.numLikes}
                              hasUserLiked={result.isLiked}
                              userId={translateAuth0Id(auth0User?.sub)}
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
                              belongsToCurrentUser={isCurrentUser}
                              userColour={userColour}
                              numLikes={result.numLikes}
                              hasUserLiked={result.isLiked}
                              userId={translateAuth0Id(auth0User?.sub)}
                            />
                          )
                        )}
                        {hasMore && (
                          <div
                            className={styles.loadingIconTimelineOuterContainer}
                            ref={bottomRef}
                          >
                            <div
                              className={
                                styles.loadingIconTimelineInnerContainer
                              }
                            >
                              <LoadingIcon colour={userColour} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!isSmallLaptop && user !== null && (
                  <div className={styles.aboutUser}>
                    <div
                      className={styles.followStatsContainerExtended}
                      style={{
                        backgroundColor: `${userColour}40`,
                      }}
                    >
                      <div className={styles.followStats}>
                        <Heading component="h2" content={`${numFollowers}`} />
                        <Body
                          className={styles.followStatsLabel}
                          content="Followers"
                        />
                      </div>
                      <div className={styles.followStats}>
                        <Heading component="h2" content={`${user.following}`} />
                        <Body
                          className={styles.followStatsLabel}
                          content="Following"
                        />
                      </div>
                      <div className={styles.followStats}>
                        <Heading component="h2" content={`${numReviews}`} />
                        <Body
                          className={styles.followStatsLabel}
                          content="Reviews"
                        />
                      </div>
                      <div className={styles.followStats}>
                        <Heading component="h2" content={`${numLists}`} />
                        <Body
                          className={styles.followStatsLabel}
                          content="Lists"
                        />
                      </div>
                    </div>
                    {user.musicNotes.length > 0 && (
                      <>
                        <Heading component="h2" content="About Me" />
                        <div className={styles.musicNotes}>
                          {user.musicNotes.map((musicNote, i) => (
                            <MusicNote
                              key={i}
                              prompt={musicNote.prompt}
                              src={musicNote.imageSrc}
                              title={musicNote.title}
                              subtitle={musicNote.subtitle}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
          {isMobile && (
            <BottomNav
              colour={userColour}
              userId={translateAuth0Id(auth0User?.sub)}
            />
          )}
          {editModalEnabled && user !== null && (
            <EditModal
              onClose={() => {
                setEditModalEnabled(false);
              }}
              colour={userColour}
              user={user}
            />
          )}
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
