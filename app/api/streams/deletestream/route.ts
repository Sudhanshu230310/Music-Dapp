import client from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  console.log(id);
  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  try {
    await client.stream.delete({
        where:{
            id : id
        }
    })

    return NextResponse.json({ message: "Stream Deleted" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
