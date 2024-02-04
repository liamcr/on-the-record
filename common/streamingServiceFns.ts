import axios from "axios";
import { redirect } from "next/navigation";
import { Entity } from "./types";

export type StreamingService = "spotify" | "appleMusic" | "amazonMusic";

interface CurrentUser {
  id: string;
  streamingService: StreamingService;
}

/**
 * A helper class that encapsulates any requests made to external streaming services (e.g. Spotify)
 */
class StreamingServiceController {
  /**
   * Helper function to make an API request
   * @param method The HTTP method, e.g. GET or POST
   * @param url The url to which you want to make the request
   * @param accessToken The user's access token
   * @param data Any data you want to send along with the API request
   * @returns The response of the request
   */
  static apiRequest = async (
    method: string,
    url: string,
    accessToken: string,
    data: any
  ) => {
    const requestResponse = await axios({
      method: method,
      url: url,
      data: Object.entries(data).length === 0 ? {} : JSON.stringify(data),
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    return requestResponse;
  };

  /**
   * Builds the URI in which the user should go to authenticate themselves
   * @param streamingService The streaming service the user wants to use
   * @param clientId The app-specific client ID
   * @param redirectUri The URI to redirect the user to after successful authentication
   * @param scopes Scopes to authenticate
   * @returns A URL
   */
  static buildAuthenticationUri(
    streamingService: StreamingService,
    clientId: string,
    redirectUri: string,
    scopes: string[]
  ) {
    if (streamingService === "spotify") {
      let authURI = `https://accounts.spotify.com/authorize?client_id=${clientId}`;

      authURI = authURI.concat(
        `&redirect_uri=${encodeURIComponent(redirectUri)}`
      );
      authURI = authURI.concat(
        `&scope=${encodeURIComponent(scopes.join(" "))}`
      );
      authURI = authURI.concat("&response_type=token");

      return authURI;
    }
    return "";
  }

  /**
   * Parse the stringified JSON from the URL hash into an object
   * @param location The window.location object
   * @returns An object representation of the URL hash
   */
  static parseURLHash(location: Location) {
    let hash = location.hash.substring(1);

    let jsonHash = `{"${hash.replace(/&/g, '","').replace(/=/g, '":"')}"}`;

    return hash ? JSON.parse(jsonHash) : {};
  }

  /**
   * Checks to see if the user's access token has expiried
   * @returns True if the token is expired, false otherwise
   */
  static isTokenExpired() {
    let currentTimeStamp = Math.floor(Date.now() / 1000);
    let authExpiry = sessionStorage.getItem("otrTokenExpiration");

    if (authExpiry !== null) {
      if (currentTimeStamp < parseInt(authExpiry)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Helper function to handle different cases when it comes to logging in.
   * @param location The window.location object
   */
  static handleLogin(location: Location) {
    if (location.search === "?error=access_denied") {
      // If the user has not given permission to use their account,
      // redirect them back to the login page
      redirect("/");
    }

    let hashData = this.parseURLHash(location);

    if (hashData.hasOwnProperty("access_token")) {
      let currentTimeStamp = Math.floor(Date.now() / 1000);

      if (hashData.access_token !== sessionStorage.getItem("otrAccessToken")) {
        let expirationTime = currentTimeStamp + parseInt(hashData.expires_in);

        sessionStorage.setItem("otrAccessToken", hashData.access_token);
        sessionStorage.setItem("otrTokenExpiration", expirationTime.toString());
        sessionStorage.setItem("otrStreamingService", "spotify");
      } else {
        if (this.isTokenExpired()) {
          redirect("/");
        }
      }
    } else {
      if (sessionStorage.getItem("otrAccessToken") === null) {
        redirect("/");
      } else if (this.isTokenExpired()) {
        redirect("/");
      }
    }
  }

  /**
   * Get the currently logged-in user information from a streaming service
   * @param streamingService The streaming service that the user has authenticated with
   * @param accessToken The user's access token for the specified streaming service
   * @returns An object representing the current user
   */
  static getCurrentUser = async (
    streamingService: StreamingService,
    accessToken: string
  ): Promise<CurrentUser> => {
    if (streamingService === "spotify") {
      const resp = await this.apiRequest(
        "GET",
        "https://api.spotify.com/v1/me",
        accessToken,
        {}
      );

      if (resp.status !== 200) {
        // Token is expired, redirect to login screen
        redirect("/");
      }

      let currentUser: CurrentUser = {
        id: resp.data.id,
        streamingService: "spotify",
      };

      return currentUser;
    }

    return {
      id: "",
      streamingService: "spotify",
    };
  };

  /**
   * Search the database of a streaming service
   * @param streamingService The streaming service to search
   * @param accessToken The user's access token to the specified streaming service
   * @param query The search query
   * @param type The type of entity to search for, e.g. album, track, etc.
   * @returns A list of results
   */
  static search = async (
    streamingService: StreamingService,
    accessToken: string,
    query: string,
    type: string
  ) => {
    if (streamingService === "spotify") {
      const resp = await this.apiRequest(
        "GET",
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=${type}&limit=5`,
        accessToken,
        {}
      );

      if (resp.status !== 200) {
        // Token is expired, redirect to login screen
        window.location.href = "/";
        return [];
      }

      let results = resp.data[`${type}s`]?.items;

      let entities: Entity[] = results.map((item: any) => {
        let subtitle = "";
        if (item.artists !== undefined && item.artists.length > 0) {
          subtitle += item.artists[0].name;
          for (let artist of item.artists.slice(1)) {
            subtitle += `, ${artist.name}`;
          }
        }

        let image = "/";
        if (type === "track") {
          if (
            item?.album?.images &&
            item.album.images.length > 0 &&
            item.album.images[0].url
          ) {
            image = item.album.images[0].url;
          }
        } else {
          if (item.images && item.images.length > 0 && item.images[0].url) {
            image = item.images[0].url;
          }
        }

        return {
          title: item.name,
          subtitle,
          imageSrc: image,
        };
      });

      return entities;
    }

    return [];
  };
}

export { StreamingServiceController };
