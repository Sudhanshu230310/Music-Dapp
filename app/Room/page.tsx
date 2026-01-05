"use client";
import RoomClient from "../components/RoomClient"
// import dynamic from "next/dynamic";

// const RoomClient = dynamic(() => import("./RoomClient"), { ssr: false });

export default function Page() {
  return <RoomClient />;
}
