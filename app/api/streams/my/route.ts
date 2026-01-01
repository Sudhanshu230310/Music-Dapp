import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const user = await client.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const streams = await client.stream.findMany({
      where: {
        userID: user.id ?? "",
      },
      include:{
        _count:{
          select:{
            upvote:true
          }
        },
        upvote:{
          where:{
            userID:user.id
          }
        }
      }
    });

    return NextResponse.json({
      streams:streams.map(({_count,...rest})=>({
        ...rest,
        upvotes:_count.upvote
      })),
    });
  } catch (e) {
    return NextResponse.json({
      message: "Bad Gateway",
    });
  }
}
