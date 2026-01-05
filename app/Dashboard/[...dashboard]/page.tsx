"use client";
import { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Music2,
  Link2,
  Plus,
  Loader2,
} from "lucide-react";
import { Badge, Button, Input } from "../../components/Button";
import { YouTubePlayer } from "../../components/VideoPlayer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useRoom } from "@/app/Context/useRoom";

export default function Dashboard() {
  const { data: session } = useSession();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [queue, setQueue] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const lamports = 1;
  const ctx=useRoom();

  // -------- Fetch Queue --------
  const refreshStream = async () => {
    const res = await axios.get("/api/streams/my");
    const sorted = [...res.data.streams].sort((a, b) => b.upvotes - a.upvotes);
    setQueue(sorted);
  };

  // -------- Derive Current Song --------
  useEffect(() => {
    if (queue.length > 0) setCurrentSong(queue[0]);
    else setCurrentSong(null);
  }, [queue]);

  // -------- Initial Load + Poll --------
  useEffect(() => {
    refreshStream();
    const id = setInterval(refreshStream, 10000);
    return () => clearInterval(id);
  }, []);

  // -------- Play Next --------
  const playNextSong = async () => {
    if (!currentSong) return;
    await axios.post("/api/streams/deletestream", { id: currentSong.id });
    await refreshStream();
  };

  // -------- Voting --------
  const handleVote = async (id: string, delta: number) => {
    if (!publicKey) {
      alert("connect the wallet");
      return;
    } else {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "ALGFDww3N2gbjenPgTMUyivKG7UKLk8CVJf62fS6h6ze"
          ),
          lamports,
        })
      );
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });
      const res = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      if(res.value.err==null){
        if (delta === 1)
          await axios.post("/api/streams/upvote", { streamID: id });
        if (delta === -1)
          await axios.post("/api/streams/downvote", { streamID: id });
        refreshStream();
      }
      else{
        alert("Somthing wents wrong");
      }
    }
  };

  // -------- YouTube ID --------
  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  };

  // -------- Submit --------
  const handleSubmit = async () => {
    const videoId = extractVideoId(url);
    if (!videoId || !session) return;
    if(ctx.roomID=="") return;
    setLoading(true);
    await axios.post("/api/streams", {
      createrId: session.user?.id,
      roomID:ctx.roomID,
      url,
    });
    setUrl("");
    setLoading(false);
    refreshStream();
  };

  const previewId = extractVideoId(url);

  return (
    <main className="h-full bg-background overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        {/* NOW PLAYING */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Now Playing</h2>
            {currentSong && <Badge>{currentSong.title}</Badge>}
          </div>

          {currentSong ? (
            <YouTubePlayer
              videoId={currentSong.extractedId}
              onEnded={playNextSong}
            />
          ) : (
            <div className="aspect-video border rounded-xl flex items-center justify-center">
              Queue is empty
            </div>
          )}

          {/* SUBMIT */}
          <div className="space-y-3">
            <h3 className="font-semibold">Submit Song</h3>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube link"
                className="pl-10"
              />
              {previewId && (
                <Button
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleSubmit}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* QUEUE */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between mb-8 items-center">
            <h2 className="flex items-center gap-2">
              <Music2 className="h-5 w-5" /> Up Next
            </h2>
            <Badge variant="secondary">{queue.length}</Badge>
          </div>

          <div className="h-[70vh] overflow-auto space-y-3">
            {queue.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-3 border rounded-xl"
              >
                <div className="flex flex-col items-center">
                  <Button size="icon" onClick={() => handleVote(song.id, 1)}>
                    <ChevronUp />
                  </Button>
                  <span>{song.upvotes}</span>
                  <Button size="icon" onClick={() => handleVote(song.id, -1)}>
                    <ChevronDown />
                  </Button>
                </div>

                <img
                  src={song.bigImage}
                  className="w-32 aspect-video rounded"
                />

                <div className="truncate">{song.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
