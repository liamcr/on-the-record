import { auth0 } from "@/lib/auth0";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { token } = await auth0.getAccessToken();
    let reqBody = await req.json();
    await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL || ""}/list/unlike`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: reqBody,
    });

    return new NextResponse(JSON.stringify({}), {
      status: 200,
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
        },
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: axiosError.response.data as string,
      }),
      {
        status: axiosError.response.status,
      },
    );
  }
};
