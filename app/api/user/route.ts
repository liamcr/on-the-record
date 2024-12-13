import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const { accessToken } = await getAccessToken();
    let reqBody = await req.json();
    let resp = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: reqBody,
    });

    return new NextResponse(
      JSON.stringify({
        id: resp.data.id,
        name: resp.data.name,
        colour: resp.data.colour,
        profilePictureSrc: resp.data.imageSrc,
        followers: 0,
        following: 0,
        createdOn: resp.data.createdOn,
        musicNotes: resp.data.musicNotes,
      }),
      {
        status: 201,
      }
    );
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

export const PUT = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const { accessToken } = await getAccessToken();
    let reqBody = await req.json();
    let resp = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: reqBody,
    });

    return new NextResponse(
      JSON.stringify({
        id: resp.data.id,
        name: resp.data.name,
        colour: resp.data.colour,
        profilePictureSrc: resp.data.imageSrc,
        followers: 0,
        following: 0,
        createdOn: resp.data.createdOn,
        musicNotes: resp.data.musicNotes,
      }),
      {
        status: 200,
      }
    );
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
