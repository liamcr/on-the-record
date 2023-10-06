"use client";

import {
  StreamingService,
  StreamingServiceController,
} from "../../common/streamingServiceFns";
import { APIWrapper } from "../../common/apiWrapper";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    StreamingServiceController.handleLogin(window.location);

    StreamingServiceController.getCurrentUser(
      sessionStorage.getItem("otrStreamingService") as StreamingService,
      sessionStorage.getItem("otrAccessToken") || ""
    ).then((user) => {
      APIWrapper.getUser(user.streamingService, user.id).then((otrUser) => {
        if (otrUser.error && otrUser.error.code === 404) {
          // User does not exist in our system, redirect to onboarding
          router.push("/onboarding");
        }

        // Do something on more general error
      });
    });
  }, []);

  return <div>Hi!</div>;
}
