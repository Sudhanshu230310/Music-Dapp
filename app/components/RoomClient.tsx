"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRoom } from "../Context/useRoom";
import { useRouter } from "next/navigation";
import { createRoomAPI, getRooms } from "./Room";

export default function RoomClient() {
  const { data: session } = useSession();
  const ctx = useRoom();
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [existedRooms, setExistedRooms] = useState<any[]>([]);

  useEffect(() => {
    const loadRooms = async () => {
      const rooms = await getRooms();
      setExistedRooms(rooms);
    };
    loadRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName || !session?.user?.id) return;

    const data = await createRoomAPI(roomName, session.user.id);

    ctx.setroomID(data.roomID);
    router.push(`/Dashboard/${data.roomID}`);
    setRoomName("");
  };

  const handleJoinRoom = () => {
    if (!joinCode) return;
    router.push(`/Dashboard/${joinCode}`);
  };

  return (
    <div className="w-screen text-black mt-10 gap-10 px-10 grid md:grid-cols-2">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center rounded-xl pt-2 font-bold h-36 bg-white">
          <div className="text-2xl">Create Room</div>
          <div className="pt-4">
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border mx-3 w-[25vw] py-2 rounded-xl"
            />
            <button
              onClick={handleCreateRoom}
              className="text-lg bg-blue-600 text-white px-3 py-2 rounded-xl"
            >
              Create Room
            </button>
          </div>
        </div>

        {/* Join */}
        <div className="flex flex-col items-center rounded-xl pt-2 font-bold h-36 bg-white">
          <div className="text-2xl">Join Room</div>
          <div className="pt-4">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="border mx-3 w-[25vw] py-2 rounded-xl"
            />
            <button
              onClick={handleJoinRoom}
              className="text-lg bg-blue-600 text-white px-3 py-2 rounded-xl"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      <div className=" bg-white max-h-[30vh] overflow-hidden rounded-xl p-4">
        <div className="text-xl font-bold mb-2">Your Rooms</div>
        <div className="flex flex-col gap-4 pt-10 overflow-auto">
          {existedRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => router.push(`/Dashboard/${room.id}`)}
              className="border px-4 py-2 rounded-xl"
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
