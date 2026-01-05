import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const session =await getServerSession();
    const user =await client.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })

    const rooms=await client.room.findMany({
        where:{
            userID:user?.id
        }
    })

    return NextResponse.json({
        rooms
    })
}