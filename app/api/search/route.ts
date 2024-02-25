import { Entity } from "@/common/types";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const type = req.nextUrl.searchParams.get("type");

  if (!query || !type) {
    return new NextResponse(
      JSON.stringify({ error: "No query or type provided in request" }),
      { status: 400 }
    );
  }

  let resp = await axios({
    method: "GET",
    url: `https://api.deezer.com/search/${type}?q=${encodeURIComponent(query)}`,
  });

  if (resp.status !== 200) {
    // Token is expired, redirect to login screen
    return new NextResponse(
      JSON.stringify({ error: "Deezer API responded with non-200 response." }),
      { status: resp.status }
    );
  }

  let results = resp.data?.data;

  let entities: Entity[] = results.map((item: any) => {
    let subtitle = "";
    if (item.artist !== undefined) {
      subtitle = item.artist.name;
    }

    let image = "/";
    let title = "";
    if (type === "track") {
      if (item.title) {
        title = item.title;
      }
      if (item.album?.cover_big) {
        image = item.album?.cover_big;
      }
    } else if (type === "album") {
      if (item.title) {
        title = item.title;
      }
      if (item.cover_big) {
        image = item.cover_big;
      }
    } else {
      if (item.name) {
        title = item.name;
      }
      if (item.picture_big) {
        image = item.picture_big;
      }
    }

    return {
      title,
      subtitle,
      imageSrc: image,
      entityId: item.id.toString(),
    };
  });

  return new NextResponse(JSON.stringify({ data: entities }), {
    status: 200,
  });
}
