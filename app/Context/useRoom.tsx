"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type RoomContextType = {
  roomID: string;
  setroomID: React.Dispatch<React.SetStateAction<string>>;
  currentSong: any | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<any | null>>;
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomID, setroomID] = useState("");
  const [currentSong, setCurrentSong] = useState<any | null>(null);

  return (
    <RoomContext.Provider
      value={{ roomID, setroomID, currentSong, setCurrentSong }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) {
    throw new Error("useRoom must be used inside RoomProvider");
  }
  return ctx;
}
