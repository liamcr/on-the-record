export type StreamingService = "spotify" | "appleMusic" | "amazonMusic";

const buildAuthenticationUri = (
  streamingService: StreamingService,
  clientId: string,
  redirectUri: string,
  scopes: string[]
) => {
  if (streamingService === "spotify") {
    let authURI = `https://accounts.spotify.com/authorize?client_id=${clientId}`;

    authURI = authURI.concat(
      `&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    authURI = authURI.concat(`&scope=${encodeURIComponent(scopes.join(" "))}`);
    authURI = authURI.concat("&response_type=token");

    return authURI;
  }
  return "";
};

export { buildAuthenticationUri };
