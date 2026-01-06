import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const { roomId } = await req.json(); 
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await client.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const room = await client.room.findUnique({
    where: { id: roomId }
  });

  if (!room) {
    return NextResponse.json({ message: "Room not found" }, { status: 404 });
  }

  const alreadyJoined = await client.join.findUnique({
    where: {
      userId_roomId: {
        userId: user.id,
        roomId: roomId,
      },
    },
  });

  if (alreadyJoined) {
    return NextResponse.json({ alreadyJoined });
  }

  const join = await client.join.create({
    data: {
      userId: user.id,
      roomId: roomId,
    },
  });

  return NextResponse.json({ join });
}
