import { auth0 } from "@/lib/auth0";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { token } = await auth0.getAccessToken();
    let reqBody = await req.json();
    let resp = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user`,
      headers: {
        Authorization: `Bearer ${token}`,
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
      },
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

export const PUT = async (req: NextRequest) => {
  try {
    const { token } = await auth0.getAccessToken();
    let reqBody = await req.json();
    let resp = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_API_URL || ""}/user`,
      headers: {
        Authorization: `Bearer ${token}`,
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
      },
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
