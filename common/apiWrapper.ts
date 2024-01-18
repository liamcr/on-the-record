import axios, { AxiosError } from "axios";
import { StreamingService } from "./streamingServiceFns";
import {
  Entity,
  EntityType,
  ListElement,
  MusicNote,
  Review,
  TimelineResponse,
  TopFiveList,
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
    host: string,
    streamingService: StreamingService,
    userId: string,
    requestingStreamingService?: StreamingService,
    requestingUserId?: string
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${host}/user?provider=${streamingService}&provider_id=${userId}${
          requestingStreamingService
            ? `&requesting_provider=${requestingStreamingService}&requesting_provider_id=${requestingUserId}`
            : ""
        }`,
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
          followers: resp.data.followers,
          following: resp.data.following,
          reviews: resp.data.reviews,
          lists: resp.data.lists,
          isFollowing: resp.data.isFollowing,
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
    host: string,
    query: string
  ): Promise<APIResponse<Entity[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${host}/user/search?query=${query}`,
        data: {},
      });

      // 200 Response
      return {
        data: resp.data.map((user: any) => ({
          imageSrc: user.imageSrc,
          title: user.name,
          href: `/profile/${user.provider}/${user.providerId}`,
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
    host: string,
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
        url: `${host}/user`,
        data: {
          provider: streamingService,
          providerId: userId,
          name: name,
          imageSrc: profilePictureSrc,
          colour: colour,
          musicNotes: musicNotes,
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
          followers: 0,
          following: 0,
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

  static updateUser = async (
    host: string,
    streamingService: StreamingService,
    userId: string,
    name: string,
    colour: string,
    profilePictureSrc: string,
    musicNotes: MusicNote[]
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "PUT",
        url: `${host}/user`,
        data: {
          provider: streamingService,
          providerId: userId,
          name: name,
          imageSrc: profilePictureSrc,
          colour: colour,
          musicNotes: musicNotes,
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
          followers: 0,
          following: 0,
          createdOn: resp.data.createdOn,
          musicNotes: resp.data.musicNotes,
        },
      };
    } catch (e) {
      const axiosError = e as AxiosError;

      console.log(e);

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

  static followUser = async (
    host: string,
    streamingService: StreamingService,
    userId: string,
    toFollowProvider: StreamingService,
    toFollowProviderId: string
  ): Promise<APIResponse<null>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `${host}/user/follow?provider=${streamingService}&provider_id=${userId}`,
        data: {
          provider: toFollowProvider,
          providerId: toFollowProviderId,
        },
      });

      // 200 Response
      return {
        data: null,
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

  static unfollowUser = async (
    host: string,
    streamingService: StreamingService,
    userId: string,
    toFollowProvider: StreamingService,
    toFollowProviderId: string
  ): Promise<APIResponse<null>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `${host}/user/unfollow?provider=${streamingService}&provider_id=${userId}`,
        data: {
          provider: toFollowProvider,
          providerId: toFollowProviderId,
        },
      });

      // 200 Response
      return {
        data: null,
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
    host: string,
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
        url: `${host}/review`,
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

  static createList = async (
    host: string,
    streamingService: StreamingService,
    userId: string,
    type: EntityType,
    title: string,
    colour: string,
    listElements: ListElement[]
  ): Promise<APIResponse<TopFiveList>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `${host}/list`,
        data: {
          provider: streamingService,
          providerId: userId,
          title: title,
          type: type,
          colour: colour,
          listElements: listElements,
        },
      });

      // 200 Response
      return {
        data: {
          title: resp.data.title,
          colour: resp.data.colour,
          timestamp: resp.data.createdOn,
          author: {
            name: "",
            profilePictureSrc: "",
            provider: streamingService,
            providerId: parseInt(userId),
          },
          id: resp.data.id,
          type: resp.data.type,
          list: resp.data.listElements,
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
    host: string,
    streamingService: StreamingService,
    userId: string,
    offset?: number,
    limit?: number
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${host}/timeline?provider=${streamingService}&provider_id=${userId}&offset=${offset}&limit=${limit}`,
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

  static getUserPosts = async (
    host: string,
    streamingService: StreamingService,
    userId: string,
    offset?: number,
    limit?: number
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${host}/user/activity?provider=${streamingService}&provider_id=${userId}&offset=${offset}&limit=${limit}`,
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
