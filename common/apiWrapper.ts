import axios, { AxiosError } from "axios";
import { StreamingService } from "./streamingServiceFns";
import {
  Entity,
  EntityType,
  MusicNote,
  Review,
  TimelineResponse,
  User,
  UserCondensed,
} from "./types";

interface APIResponse<T> {
  data?: T;
  error?: {
    code?: number;
    message?: string;
  };
}

class APIWrapper {
  static getUser = async (
    streamingService: StreamingService,
    userId: string
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `http://localhost:8080/user?provider=${streamingService}&provider_id=${userId}`,
        data: {},
      });

      // 200 Response
      return {
        data: {
          provider: resp.data.provider,
          providerId: resp.data.providerId,
          name: resp.data.name,
          colour: resp.data.colour,
          profilePictureSrc: resp.data.imageSrc,
          createdOn: resp.data.createdOn,
          musicNotes: resp.data.musicNotes,
        },
      };
    } catch (e) {
      const axiosError = e as AxiosError;

      if (!axiosError.response) {
        return {
          error: {
            code: 500,
            message: "Something went wrong",
          },
        };
      }

      return {
        error: {
          code: axiosError.response.status,
          message: axiosError.response.data as string,
        },
      };
    }
  };

  static searchUsers = async (
    query: string
  ): Promise<APIResponse<Entity[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `http://localhost:8080/user/search?query=${query}`,
        data: {},
      });

      // 200 Response
      return {
        data: resp.data.map((user: any) => ({
          imageSrc: user.imageSrc,
          title: user.name,
          href: `user/${user.provider}/${user.providerId}`,
        })),
      };
    } catch (e) {
      const axiosError = e as AxiosError;

      if (!axiosError.response) {
        return {
          error: {
            code: 500,
            message: "Something went wrong",
          },
        };
      }

      return {
        error: {
          code: axiosError.response.status,
          message: axiosError.response.data as string,
        },
      };
    }
  };

  static createUser = async (
    streamingService: StreamingService,
    userId: string,
    name: string,
    colour: string,
    profilePictureSrc: string,
    musicNotes: MusicNote[]
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `http://localhost:8080/user`,
        data: {
          provider: streamingService,
          providerId: userId,
          name: name,
          imageSrc: profilePictureSrc,
          colour: colour,
          musicNotes: musicNotes,
          createdOn: Date.now(),
        },
      });

      // 200 Response
      return {
        data: {
          provider: resp.data.provider,
          providerId: resp.data.providerId,
          name: resp.data.name,
          colour: resp.data.colour,
          profilePictureSrc: resp.data.imageSrc,
          createdOn: resp.data.createdOn,
          musicNotes: resp.data.musicNotes,
        },
      };
    } catch (e) {
      const axiosError = e as AxiosError;

      if (!axiosError.response) {
        return {
          error: {
            code: 500,
            message: "Something went wrong",
          },
        };
      }

      return {
        error: {
          code: axiosError.response.status,
          message: axiosError.response.data as string,
        },
      };
    }
  };

  static createReview = async (
    streamingService: StreamingService,
    userId: string,
    type: EntityType,
    title: string,
    subtitle: string,
    imageSrc: string,
    score: number,
    body: string
  ): Promise<APIResponse<Review>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `http://localhost:8080/review`,
        data: {
          provider: streamingService,
          providerId: userId,
          title: title,
          imageSrc: imageSrc,
          subtitle: subtitle,
          score: score,
          body: body,
          type: type,
        },
      });

      // 200 Response
      return {
        data: {
          title: resp.data.title,
          colour: resp.data.colour,
          src: resp.data.imageSrc,
          timestamp: resp.data.createdOn,
          author: {
            name: "",
            profilePictureSrc: "",
            provider: streamingService,
            providerId: parseInt(userId),
          },
          id: resp.data.id,
          score: resp.data.score,
          subtitle: resp.data.subtitle,
          type: resp.data.type,
          review: resp.data.review,
        },
      };
    } catch (e) {
      const axiosError = e as AxiosError;

      if (!axiosError.response) {
        return {
          error: {
            code: 500,
            message: "Something went wrong",
          },
        };
      }

      return {
        error: {
          code: axiosError.response.status,
          message: axiosError.response.data as string,
        },
      };
    }
  };

  static getTimeline = async (
    streamingService: StreamingService,
    userId: string
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `http://localhost:8080/timeline?provider=${streamingService}&provider_id=${userId}`,
        data: {},
      });

      // 200 Response
      return {
        data: resp.data.map((respElement: any) => ({
          ...respElement,
          author: {
            provider: respElement.author.provider,
            providerId: respElement.author.providerId,
            profilePictureSrc: respElement.author.imageSrc,
            name: respElement.author.name,
          },
        })),
      };
    } catch (e) {
      const axiosError = e as AxiosError;

      if (!axiosError.response) {
        return {
          error: {
            code: 500,
            message: "Something went wrong",
          },
        };
      }

      return {
        error: {
          code: axiosError.response.status,
          message: axiosError.response.data as string,
        },
      };
    }
  };
}

export { APIWrapper };
