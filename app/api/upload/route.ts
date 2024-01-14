import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { generateUUID } from "@/common/functions";

const BUCKET_NAME = "on-the-record-images";

const s3 = new AWS.S3({});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (file === null) {
    return new NextResponse(
      JSON.stringify({ error: "No file provided in request" }),
      { status: 400 }
    );
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

    return new NextResponse(JSON.stringify({ url: data.Location }), {
      status: 201,
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: "Something went wrong uploading your image..." }),
      { status: 500 }
    );
  }
}
