import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ message: "Room ID missing" }, { status: 400 });
  }

  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await client.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const streams = await client.stream.findMany({
    where: {
      roomId: roomId
    },
    include: {
      _count: {
        select: { upvote: true }
      },
      upvote: {
        where: { userID: user.id }
      }
    },
    orderBy: {
      upvote: { _count: "desc" }
    }
  });

  return NextResponse.json({
    streams: streams.map(({ _count, upvote, ...rest }) => ({
      ...rest,
      votes: _count.upvote,
      hasUpvoted: upvote.length > 0
    }))
  });
}
