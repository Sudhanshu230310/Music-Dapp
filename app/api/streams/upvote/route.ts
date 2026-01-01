import client from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema= z.object({
    streamID :z.string()
})

export async function POST(req:NextRequest){
    const session =await getServerSession();

    const user =await client.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })

    if(!user){
        return NextResponse.json({
            message:"unauthenticated"
        },{
            status:403
        })
    }

    try{
        const data=UpvoteSchema.parse(await req.json())
        await client.upvote.create({
            data:{
                userID:user.id,
                streamId:data.streamID
            }
        })
        NextResponse.json({
            message:"Upvote Successfully"
        },{
            status:200
        })
    }catch(e){
        return NextResponse.json({
            message:"Error while upvoting"
        },{
            status:403
        })
    }
}