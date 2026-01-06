import axios from "axios";

export async function createRoomAPI(roomName: string, userId: string) {
    
  const res = await axios.post("/api/rooms/createroom", {
    roomName,
    id: userId,
  });
  return res;
}

export async function getRooms(){
    const res=await axios.get("/api/rooms/getrooms");
    return res.data.rooms
}

export async function joinRoom(roomID:string){
    const res=await axios.post("/api/rooms/joinroom",{
        roomId:roomID
    })
    console.log(res.data);
    return res;
}

