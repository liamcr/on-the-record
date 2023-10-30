import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { generateUUID } from "@/common/functions";

const BUCKET_NAME = "on-the-record-images";

const s3 = new AWS.S3({});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (file === null) {
    return new Response("Hello");
  }

  const suffix = file.name.split(".")[file.name.split(".").length - 1];

  const arrayBuffer = await file.arrayBuffer();

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${generateUUID()}.${suffix}`,
    Body: Buffer.from(arrayBuffer),
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();

    return new Response(JSON.stringify({ url: data.Location }));
  } catch (err) {
    return new Response("Error");
  }
}
