import axios from "axios";

export async function createRoomAPI(roomName: string, userId: string) {
    
  const res = await axios.post("/api/rooms/createroom", {
    roomName,
    id: userId,
  });
  console.log(res.data);
  return res.data;
}

export async function getRooms(){
    const res=await axios.get("/api/rooms/getrooms");
    return res.data.rooms
}