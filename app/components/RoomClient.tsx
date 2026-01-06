"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRoom } from "../Context/useRoom";
import { useRouter } from "next/navigation";
import { createRoomAPI, getRooms, joinRoom } from "./Room";

export default function RoomClient() {
  const { data: session } = useSession();
  const ctx = useRoom();
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [existedRooms, setExistedRooms] = useState<any[]>([]);

  const loadRooms = async () => {
    const rooms = await getRooms();
    setExistedRooms(rooms);
  };
    

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
    // ctx?.setroomID(data.data.res.id);
    // router.push(`Dashboard/${data.data.res.id}`);
    loadRooms();
    setRoomName("");
  };

  const handleJoinRoom = async () => {
    if (!joinCode || !session?.user?.id) return;
    const roomID = joinCode;
    const data = await joinRoom(roomID);
    ctx?.setroomID(joinCode);
    router.push(`Dashboard/${joinCode}`);
    setJoinCode("");
  };

  return (
    <div className="w-screen text-black mt-10 gap-10 px-10 grid md:grid-cols-2">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-4 rounded-xl p-4 font-bold bg-white">
          <div className="text-2xl">Create Room</div>

          <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-xl">
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="col-span-2 border px-4 py-2 rounded-xl w-full"
              placeholder="Room name"
            />

            <button
              onClick={handleCreateRoom}
              className="bg-blue-600 hover:bg-blue-700 h-10 text-white rounded-xl font-semibold"
            >
              Create
            </button>
          </div>
        </div>

        {/* Join */}
        <div className="flex flex-col items-center rounded-xl p-4 gap-4 font-bold bg-white">
          <div className="text-2xl">Join Room</div>

          <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-xl">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="col-span-2 border px-4 py-2 rounded-xl w-full"
              placeholder="Room ID"
            />

            <button
              onClick={handleJoinRoom}
              className="bg-blue-600 hover:bg-blue-700 h-10 text-white rounded-xl font-semibold"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Your Rooms */}
      <div className=" rounded-xl p-4 flex flex-col">
        <div className="text-xl  text-white font-bold mb-2 pb-10">
          Your Rooms
        </div>
        <div className="h-[70vh] overflow-auto mt-10 space-y-3">
          {existedRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onOpen={async () => {
                const data = await joinRoom(room.id);
                console.log(room.id);
                // console.log(data.data.alreadyJoined.roomId);
                ctx?.setroomID(room.id);
                router.push(`Dashboard/${room.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type Room = {
  id: string;
  name: string;
  isActive: boolean;
  userID: string;
  createdAt: string;
};

function RoomCard({ room, onOpen }: { room: Room; onOpen?: () => void }) {
  return (
    <div className="w-80 rounded-2xl bg-white border border-white/10 p-4 text-black shadow-xl hover:scale-[1.02] transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold truncate">{room.name}</div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            room.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {room.isActive ? "Active" : "Closed"}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 space-y-1 text-sm text-black">
        <div>
          <span className="text-white/40">Room ID:</span> {room.id}
        </div>
        <div>
          <span className="text-white/40">Owner:</span>{" "}
          {room.userID.slice(0, 8)}...
        </div>
        <div>
          <span className="text-white/40">Created:</span>{" "}
          {new Date(room.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onOpen}
        className="mt-4 text-white w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-semibold transition"
      >
        Join Room
      </button>
    </div>
  );
}
