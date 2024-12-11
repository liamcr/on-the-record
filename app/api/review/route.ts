import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const { accessToken } = await getAccessToken();
    await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_API_URL}/review${req.nextUrl.search}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return new NextResponse(null, {
      status: 204,
    });
  } catch (e) {
    const axiosError = e as AxiosError;

    if (!axiosError.response) {
      return new NextResponse(
        JSON.stringify({
          message: "Something went wrong",
        }),
        {
          status: 500,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: axiosError.response.data as string,
      }),
      {
        status: axiosError.response.status,
      }
    );
  }
});
