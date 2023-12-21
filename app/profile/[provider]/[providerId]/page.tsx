"use client";

import {
  StreamingService,
  StreamingServiceController,
} from "../../../../common/streamingServiceFns";
import { APIWrapper } from "../../../../common/apiWrapper";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { useMediaQuery } from "@mui/material";

import styles from "./page.module.css";
import BottomNav from "@/components/BottomNav/BottomNav";
import SideNav from "@/components/SideNav/SideNav";
import Search from "@/components/Search/Search";
import {
  Entity,
  EntityType,
  PostType,
  TimelineResponse,
  User,
} from "@/common/types";
import Image from "next/image";
import Heading from "@/components/Heading/Heading";
import Body from "@/components/Body/Body";
import MusicNote from "@/components/MusicNote/MusicNote";
import TopFive from "@/components/TopFive/TopFive";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function Profile({
  params,
}: {
  params: { provider: string; providerId: string };
}) {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 770px)");

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userColour, setUserColour] = useState("#888");

  const [userProvider, setUserProvider] = useState("");
  const [userProviderId, setUserProviderId] = useState(-1);

  const [searchEnabled, setSearchEnabled] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const [results, setResults] = useState<TimelineResponse[]>([]);
  const [numReviews, setNumReviews] = useState(0);
  const [numLists, setNumLists] = useState(0);

  const isCurrentUser = useMemo(() => {
    return (
      params.provider === userProvider &&
      params.providerId === userProviderId.toString()
    );
  }, [userProvider, userProviderId]);

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

        APIWrapper.getUser(
          params.provider as StreamingService,
          params.providerId,
          otrUser.data?.provider,
          otrUser.data?.providerId.toString(10)
        ).then((specifiedUser) => {
          if (specifiedUser.error || specifiedUser.data === undefined) {
            // TODO: Come up with designs for error case
            setIsError(true);
            return;
          }

          setUser(specifiedUser.data);
          if (specifiedUser.data.isFollowing !== undefined) {
            setIsFollowing(specifiedUser.data.isFollowing);
          }
          setIsLoadingUser(false);

          APIWrapper.getUserPosts(
            params.provider as StreamingService,
            params.providerId
          ).then((timelineResp) => {
            if (timelineResp.error) {
              // TODO: Come up with designs for error case
              setIsError(true);
              return;
            }

            setIsLoadingTimeline(false);
            const activityResults = timelineResp.data || [];

            let reviewCount = 0;
            let listCount = 0;
            for (let post of activityResults) {
              if (post.type === PostType.Review) {
                reviewCount++;
              } else if (post.type === PostType.List) {
                listCount++;
              }
            }

            setResults(timelineResp.data || []);
            setNumReviews(reviewCount);
            setNumLists(listCount);
          });
        });
      });
    });
  }, []);

  const onFollowClick = () => {
    setIsLoadingFollow(true);
    if (!isFollowing) {
      APIWrapper.followUser(
        userProvider as StreamingService,
        userProviderId.toString() || "",
        params.provider as StreamingService,
        params.providerId
      )
        .then(() => {
          setIsFollowing(true);
        })
        .catch((err) => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoadingFollow(false);
        });
    } else {
      APIWrapper.unfollowUser(
        userProvider as StreamingService,
        userProviderId.toString() || "",
        params.provider as StreamingService,
        params.providerId
      )
        .then(() => {
          setIsFollowing(false);
        })
        .catch((err) => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoadingFollow(false);
        });
    }
  };

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
            {user !== null && (
              <>
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
                        }
                      }}
                      disabled={isLoadingFollow}
                      style={{
                        color: `${userColour}80`,
                      }}
                    >
                      {isCurrentUser && (
                        <EditOutlinedIcon className={styles.followButtonIcon} />
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
                {isMobile && (
                  <>
                    <div
                      className={styles.followStatsContainer}
                      style={{
                        backgroundColor: `${userColour}40`,
                      }}
                    >
                      <div className={styles.followStats}>
                        <Heading component="h2" content={`${user.followers}`} />
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
                  <Heading component="h2" content="Activity" />
                  {isLoadingTimeline && (
                    <div className={styles.loadingIconTimelineOuterContainer}>
                      <div className={styles.loadingIconTimelineInnerContainer}>
                        <LoadingIcon colour={userColour} />
                      </div>
                    </div>
                  )}
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
                            score={result.data.score}
                            src={result.data.imageSrc}
                            subtitle={result.data.subtitle}
                            timestamp={result.timestamp}
                            title={result.data.title}
                            type={result.data.type}
                            colour={result.data.colour}
                            review={result.data.body}
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
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
          {!isMobile && user !== null && (
            <div className={styles.aboutUser}>
              <div
                className={styles.followStatsContainerExtended}
                style={{
                  backgroundColor: `${userColour}40`,
                }}
              >
                <div className={styles.followStats}>
                  <Heading component="h2" content={`${user.followers}`} />
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
                  <Body className={styles.followStatsLabel} content="Reviews" />
                </div>
                <div className={styles.followStats}>
                  <Heading component="h2" content={`${numLists}`} />
                  <Body className={styles.followStatsLabel} content="Lists" />
                </div>
              </div>
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
            </div>
          )}
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
