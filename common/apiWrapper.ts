import axios, { AxiosError } from "axios";
import {
  Entity,
  EntityType,
  ListElement,
  MusicNote,
  PostType,
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
   * @param userId The ID of the user to get
   * @param requestingUserId The ID of the user making this API call
   * @returns The requested user
   */
  static getUser = async (
    userId: string,
    requestingUserId?: string
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user?id=${userId}${
          requestingUserId ? `&requesting_id=${requestingUserId}` : ""
        }`,
        data: {},
      });

      // 200 Response
      return {
        data: {
          id: resp.data.id,
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
          id: featuredUser.id,
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
          href: `/profile/${user.id}`,
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
   * @param name The name of the user
   * @param colour The user's preferred colour
   * @param profilePictureSrc The S3 URL corresponding to the user's profile picture
   * @param musicNotes An array of the user's music notes
   * @returns The created user
   */
  static createUser = async (
    name: string,
    colour: string,
    profilePictureSrc: string,
    musicNotes: MusicNote[]
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `/api/user`,
        data: {
          name: name,
          imageSrc: profilePictureSrc,
          colour: colour,
          musicNotes: musicNotes,
        },
      });

      // 200 Response
      return {
        data: resp.data,
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
   * @param userId The ID of the user
   * @param name The name of the user
   * @param colour The user's preferred colour
   * @param profilePictureSrc The S3 URL corresponding to the user's profile picture
   * @param musicNotes An array of the user's music notes
   * @returns The updated user
   */
  static updateUser = async (
    userId: string,
    name: string,
    colour: string,
    profilePictureSrc: string,
    musicNotes: MusicNote[]
  ): Promise<APIResponse<User>> => {
    try {
      const resp = await axios({
        method: "PUT",
        url: `/api/user`,
        data: {
          id: userId,
          name: name,
          imageSrc: profilePictureSrc,
          colour: colour,
          musicNotes: musicNotes,
        },
      });

      // 200 Response
      return {
        data: resp.data,
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
   * @param userId User ID of the user being followed
   * @returns
   */
  static followUser = async (userId: string): Promise<APIResponse<null>> => {
    try {
      await axios({
        method: "POST",
        url: `/api/user/follow`,
        data: {
          id: userId,
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
   * @param userId User ID of the user being unfollowed
   * @returns
   */
  static unfollowUser = async (userId: string): Promise<APIResponse<null>> => {
    try {
      await axios({
        method: "POST",
        url: `/api/user/unfollow`,
        data: {
          id: userId,
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
   * @param entityId The entity ID of the entity being reviewed
   * @param type The type of review (Album or Track)
   * @param title The title of the review (Album or track title)
   * @param subtitle The subtitle of the review (Typically the artist name)
   * @param imageSrc The URL pointing to the album art of the review
   * @param score The score (out of 10)
   * @param body The review body
   * @returns The created review
   */
  static createReview = async (
    entityId: string,
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
        url: `/api/review`,
        data: {
          entityId: entityId,
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
            id: resp.data.userId,
          },
          id: resp.data.id,
          entityId: resp.data.entityId,
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
        url: `/api/review?id=${id}`,
      });

      // 204 Response
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
   * @param type The type of list (Track, Album, Artist)
   * @param title The title of the list
   * @param colour The background colour of the list
   * @param listElements An array of the elements within the list
   * @returns The created list
   */
  static createList = async (
    type: EntityType,
    title: string,
    colour: string,
    listElements: ListElement[]
  ): Promise<APIResponse<TopFiveList>> => {
    try {
      const resp = await axios({
        method: "POST",
        url: `/api/list`,
        data: {
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
            id: resp.data.userId,
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
        url: `/api/list?id=${id}`,
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
   * @param userId The user ID of the user getting their timeline
   * @param offset The index to start collecting posts from
   * @param limit The maximum number of posts you want to retrieve
   * @returns A list of posts
   */
  static getTimeline = async (
    userId: string,
    offset?: number,
    limit?: number
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/timeline?id=${userId}&offset=${offset}&limit=${limit}`,
        data: {},
      });

      // 200 Response
      return {
        data: resp.data.map((respElement: any) => ({
          ...respElement,
          author: {
            id: respElement.author.id,
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
   * @param userId The ID of the user
   * @param requestingUserId The ID of the user requesting the posts
   * @param offset The index to start collecting posts from
   * @param limit The maximum number of posts you want to retrieve
   * @returns A list of posts
   */
  static getUserPosts = async (
    userId: string,
    requestingUserId: string,
    offset?: number,
    limit?: number
  ): Promise<APIResponse<TimelineResponse[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/user/activity?id=${userId}&requesting_id=${requestingUserId}&offset=${offset}&limit=${limit}`,
        data: {},
      });

      // 200 Response
      return {
        data: resp.data.map((respElement: any) => ({
          ...respElement,
          author: {
            id: respElement.author.id,
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
   * Like a post
   * @param userId The ID of the user liking the post
   * @param postId The ID of the post being liked
   * @param postType The type of post (review or list)
   */
  static likePost = async (
    userId: string,
    postId: number | string,
    postType: PostType
  ): Promise<APIResponse<boolean>> => {
    try {
      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/${
          postType === PostType.List ? "list" : "review"
        }/like`,
        data: {
          userId: userId,
          listId: postId,
          reviewId: postId,
        },
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
   * Unlike a post
   * @param userId The ID of the user liking the post
   * @param postId The ID of the post being liked
   * @param postType The type of post (review or list)
   */
  static unlikePost = async (
    userId: string,
    postId: number | string,
    postType: PostType
  ): Promise<APIResponse<boolean>> => {
    try {
      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/${
          postType === PostType.List ? "list" : "review"
        }/unlike`,
        data: {
          userId: userId,
          listId: postId,
          reviewId: postId,
        },
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
   * Get a list of users that liked a post
   * @param postId The ID of the post being liked
   * @param postType The type of post (review or list)
   * @returns A list of users
   */
  static getPostLikes = async (
    postId: string | number,
    postType: PostType
  ): Promise<APIResponse<UserCondensed[]>> => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL || ""}/${
          postType === PostType.List ? "list" : "review"
        }/likes?id=${postId}`,
      });

      // 200 Response
      return {
        data: resp.data.map((respElement: any) => ({
          id: respElement.id,
          profilePictureSrc: respElement.imageSrc,
          name: respElement.name,
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
