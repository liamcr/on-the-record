"use client";

import {
  StreamingService,
  StreamingServiceController,
} from "../../../../common/streamingServiceFns";
import { APIWrapper } from "../../../../common/apiWrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { useMediaQuery } from "@mui/material";

import styles from "./page.module.css";
import BottomNav from "@/components/BottomNav/BottomNav";
import SideNav from "@/components/SideNav/SideNav";
import Search from "@/components/Search/Search";
import { Entity, EntityType, User } from "@/common/types";
import Image from "next/image";
import Heading from "@/components/Heading/Heading";
import Body from "@/components/Body/Body";

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
          params.providerId
        ).then((specifiedUser) => {
          if (specifiedUser.error || specifiedUser.data === undefined) {
            // TODO: Come up with designs for error case
            setIsError(true);
            return;
          }

          console.log(specifiedUser);

          setUser(specifiedUser.data);
          setIsLoadingUser(false);
        });
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
                </div>
                {isMobile && (
                  <>
                    <div>followers/following</div>
                    <div>Music notes</div>
                  </>
                )}
                <div className={styles.activityContainer}>
                  <Heading component="h2" content="Activity" />
                </div>
              </>
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
