"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type RoomContextType = {
  roomID: string;
  setroomID: React.Dispatch<React.SetStateAction<string>>;
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomID, setroomID] = useState("");

  return (
    <RoomContext.Provider value={{ roomID, setroomID }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  // if (!ctx) throw new Error("useRoom must be used inside RoomProvider");
  return ctx;
}
