import axios from "axios";
import { redirect } from "next/navigation";
import { Entity } from "./types";

export type StreamingService = "spotify" | "appleMusic" | "amazonMusic";

interface CurrentUser {
  id: string;
  streamingService: StreamingService;
}

class StreamingServiceController {
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

  static parseURLHash(location: Location) {
    let hash = location.hash.substring(1);

    let jsonHash = `{"${hash.replace(/&/g, '","').replace(/=/g, '":"')}"}`;

    return hash ? JSON.parse(jsonHash) : {};
  }

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
        // TODO: Handle errors in this function better
        console.log(resp);
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

        let image = "#";
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
