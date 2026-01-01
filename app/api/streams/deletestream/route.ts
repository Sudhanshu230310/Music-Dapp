import client from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  try {
    await client.stream.update({
      where: { id },
      data: { active: true },   
    });

    return NextResponse.json({ message: "Stream Deactivated" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
