import axios, { AxiosError } from "axios";
import { StreamingService } from "./streamingServiceFns";
import { User } from "./types";

interface APIResponse<T> {
  data?: T;
  error?: {
    code?: number;
    message?: string;
  };
}

class APIWrapper {
  static apiRequest = async (method: string, endpoint: string, data: any) => {
    const requestResponse = await axios({
      method: method,
      url: `http://localhost:8080${endpoint}`,
      data: Object.entries(data).length === 0 ? {} : JSON.stringify(data),
    });

    return requestResponse;
  };

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
          id: resp.data.id,
          name: resp.data.name,
          colour: resp.data.colour,
          profilePictureSrc: resp.data.image_src,
          createdOn: resp.data.created_on,
          musicNotes: resp.data.music_notes,
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
