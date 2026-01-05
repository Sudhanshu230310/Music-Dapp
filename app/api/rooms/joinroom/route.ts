import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    const session =await getServerSession();
    const data=await req.json();

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

    const room =await client.room.findFirst({
        where:{
            name: data?.roomName
        }
    })

    if(!room){
        return NextResponse.json({
            message:"Room does not exist"
        })
    }

    try{
        const res=await client.room.create({
            data:{
                name:data.roomName,
                userID: user?.id
            }
        })
        NextResponse.json({
            res
        })
    }catch(e){
        return NextResponse.json({
            message:"Somthing wents wrong"
        })
    }
}
