import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import client from "../../../lib/db";
import youtubesearchapi from "youtube-search-api"
var yt_regex = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreatStreamSchema = z.object({
  createrId: z.string(),
  url: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // ✅ read once
    console.log("hello", body);

    const data = CreatStreamSchema.parse(body);

    const isYt = data.url.match(yt_regex);
    if (!isYt) {
      return NextResponse.json(
        { message: "Wrong url format" },
        { status: 400 } // ✅ 400, not 411
      );
    }

    const extractedId = isYt[1]; // ✅ safer extraction

    const res = await youtubesearchapi.GetVideoDetails(extractedId);

    const thumbnail = res.thumbnail.thumbnails;
    thumbnail.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    await client.stream.create({
      data: {
        userID: data.createrId,
        url: data.url,
        extractedId,
        type: "YouTube",
        title: res.title ?? "Can't find video",
        smallImg:
          (thumbnail.length > 1
            ? thumbnail[thumbnail.length - 2].url
            : thumbnail[thumbnail.length - 1].url) ?? "",
        bigImage: thumbnail[thumbnail.length - 1]?.url ?? "",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Error while adding stream" },
      { status: 500 } // ✅ not 411
    );
  }
}
