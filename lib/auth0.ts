import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: "https://otr-api-rlq4ygd4nq-uc.a.run.app",
  },
});
