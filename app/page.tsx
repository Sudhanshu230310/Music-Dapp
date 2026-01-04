"use client";

import MusicLandingPage from "./components/LandingPage";

export default function Home() {
  const endpoint = "https://api.devnet.solana.com";
  return (
    <div className="w-screen bg-black text-white">
      <MusicLandingPage />
    </div>
  );
}
