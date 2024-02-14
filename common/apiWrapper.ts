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

/**
 * Generic type representing the response of an API call.
 */
interface APIResponse<T> {
  /**
   * The data returned from the API call. Undefined if there was an error.
   */
  data?: T;
  /**
   * The error returned from the APU call. Undefined if the API call resulted in a success.
   */
  error?: {
    /**
     * The HTTP status code of the API response.
     */
    code?: number;
    /**
     * The human-readable error message from the API.
     */
    message?: string;
  };
}

/**
 * Wrapper class that includes various API functions.
 */
class APIWrapper {
  /**
   * Get a user from the database.
   * @param streamingService The streaming service that the user to get authorized with
   * @param userId The ID of the user to get
   * @param requestingStreamingService The streaming service of the user making this API call
   * @param requestingUserId The ID of the user making this API call
   * @returns The requested user
   */
  static getUser = async (
    streamingService: StreamingService,
    userId: string,
    requestingStreamingService?: StreamingService,
    requestingUserId?: string
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/user?provider=${streamingService}&provider_id=${userId}${
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

  /**
   * Gets a list of the currently featured users
   * @returns A list of the featured users
   */
  static getFeaturedUsers = async (): Promise<APIResponse<UserCondensed[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user/featured`,
        data: {},
      });

      // 200 Response
      return {
        data: resp.data.map((featuredUser: any) => ({
          name: featuredUser.name,
          profilePictureSrc: featuredUser.imageSrc,
          provider: featuredUser.provider,
          providerId: featuredUser.providerId,
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

  /**
   * Search for a user in the database.
   * @param query The query used to search for users
   * @returns A list of matching users
   */
  static searchUsers = async (
    query: string
  ): Promise<APIResponse<Entity[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/user/search?query=${query}`,
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

  /**
   * Create a new user
   * @param streamingService The streaming service that the new user is associated with
   * @param userId The ID of the user
   * @param name The name of the user
   * @param colour The user's preferred colour
   * @param profilePictureSrc The S3 URL corresponding to the user's profile picture
   * @param musicNotes An array of the user's music notes
   * @returns The created user
   */
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
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user`,
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

  /**
   * Update an existing user
   * @param streamingService The streaming service that the updated user is associated with
   * @param userId The ID of the user
   * @param name The name of the user
   * @param colour The user's preferred colour
   * @param profilePictureSrc The S3 URL corresponding to the user's profile picture
   * @param musicNotes An array of the user's music notes
   * @returns The updated user
   */
  static updateUser = async (
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
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user`,
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

  /**
   * Follow a user
   * @param streamingService Streaming service of the user requesting to follow
   * @param userId User ID of the user requesting to follow
   * @param toFollowProvider Streaming service of the user being followed
   * @param toFollowProviderId User ID of the user being followed
   * @returns
   */
  static followUser = async (
    streamingService: StreamingService,
    userId: string,
    toFollowProvider: StreamingService,
    toFollowProviderId: string
  ): Promise<APIResponse<null>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/user/follow?provider=${streamingService}&provider_id=${userId}`,
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

  /**
   * Unfollow a user
   * @param streamingService Streaming service of the user requesting to unfollow
   * @param userId User ID of the user requesting to unfollow
   * @param toFollowProvider Streaming service of the user being unfollowed
   * @param toFollowProviderId User ID of the user being unfollowed
   * @returns
   */
  static unfollowUser = async (
    streamingService: StreamingService,
    userId: string,
    toFollowProvider: StreamingService,
    toFollowProviderId: string
  ): Promise<APIResponse<null>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/user/unfollow?provider=${streamingService}&provider_id=${userId}`,
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

  /**
   * Create a new review
   * @param streamingService The streaming service of the user creating the review
   * @param userId The user ID of the user creating the review
   * @param type The type of review (Album or Track)
   * @param title The title of the review (Album or track title)
   * @param subtitle The subtitle of the review (Typically the artist name)
   * @param imageSrc The URL pointing to the album art of the review
   * @param score The score (out of 10)
   * @param body The review body
   * @returns The created review
   */
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
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/review`,
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
            providerId: userId,
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

  /**
   * Delete a review
   * @param id The ID of the review
   * @returns
   */
  static deleteReview = async (id: number): Promise<APIResponse<boolean>> => {
    try {
      await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/review?id=${id}`,
      });

      // 200 Response
      return {
        data: true,
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

  /**
   * Create a new list
   * @param streamingService The streaming service of the user creating the list
   * @param userId The user ID of the user creating the list
   * @param type The type of list (Track, Album, Artist)
   * @param title The title of the list
   * @param colour The background colour of the list
   * @param listElements An array of the elements within the list
   * @returns The created list
   */
  static createList = async (
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
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/list`,
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
            providerId: userId,
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

  /**
   * Delete a list
   * @param id The ID of the list to delete
   * @returns
   */
  static deleteList = async (id: string): Promise<APIResponse<boolean>> => {
    try {
      await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/list?id=${id}`,
      });

      // 200 Response
      return {
        data: true,
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

  /**
   * Get a list of posts included in a user's timeline.
   * @param streamingService The streaming service of the user getting their timeline
   * @param userId The user ID of the user getting their timeline
   * @param offset The index to start collecting posts from
   * @param limit The maximum number of posts you want to retrieve
   * @returns A list of posts
   */
  static getTimeline = async (
    streamingService: StreamingService,
    userId: string,
    offset?: number,
    limit?: number
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/timeline?provider=${streamingService}&provider_id=${userId}&offset=${offset}&limit=${limit}`,
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

  /**
   * Get a list of posts posted by a specific user
   * @param streamingService The streaming service of the user
   * @param userId The ID of the user
   * @param offset The index to start collecting posts from
   * @param limit The maximum number of posts you want to retrieve
   * @returns A list of posts
   */
  static getUserPosts = async (
    streamingService: StreamingService,
    userId: string,
    offset?: number,
    limit?: number
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/user/activity?provider=${streamingService}&provider_id=${userId}&offset=${offset}&limit=${limit}`,
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
