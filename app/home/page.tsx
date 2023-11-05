"use client";

import {
  StreamingService,
  StreamingServiceController,
} from "../../common/streamingServiceFns";
import { APIWrapper } from "../../common/apiWrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userColour, setUserColour] = useState("#888");

  useEffect(() => {
    const colour = sessionStorage.getItem("otrColour");
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
          if (otrUser.error && otrUser.error.code === 404) {
            sessionStorage.setItem("otrStreamingServiceId", user.id);
            // User does not exist in our system, redirect to onboarding
            router.push("/onboarding");
          } else if (otrUser.error) {
            // TODO: Come up with designs for error case
            setIsError(true);
          }
        });
      })
      .finally(() => {
        // setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading && (
        <div className={styles.loadingIconOuterContainer}>
          <div className={styles.loadingIconInnerContainer}>
            <LoadingIcon colour={userColour} />
          </div>
        </div>
      )}
    </div>
  );
}
