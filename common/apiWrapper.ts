import axios, { AxiosError } from "axios";
import { StreamingService } from "./streamingServiceFns";
import { MusicNote, User } from "./types";

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
}

export { APIWrapper };
