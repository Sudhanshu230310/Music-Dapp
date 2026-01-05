"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Navbar() {
  const islogin = useSession();
  const router = useRouter();
  useEffect(() => {
    if (islogin.status == "authenticated") {
      router.push("Room");
    } else {
      router.push("/");
    }
  }, [islogin.status]);
  return (
    <div className="z-10 h-20 flex justify-between items-center px-6 py-2 text-lg sticky top-0 bg-black text-white border-b border-gray-400">
      <div className="font-bold text-3xl font-serif">Muzi</div>
      <div className="text-white flex justify-center items-center gap-3">
        <div className="">
          <WalletMultiButton
          style={{
            // backgroundColor: "red",
            padding: "2px 10px", // Y and X padding
            fontSize: "15px",
            height: "36px",
            lineHeight: "16px",
            minHeight: "24px",
            borderRadius: "4px",
          }}
        />
        </div>
        <div>
          {islogin.status == "unauthenticated" && (
          <button
            onClick={() => signIn()}
            className="px-4 py-1 rounded-xl text-xl font-light bg-blue-600"
          >
            Login
          </button>
        )}
        {islogin.status == "authenticated" && (
          <button
            onClick={() => signOut()}
            className="px-4 py-1 rounded-xl bg-blue-600"
          >
            Logout
          </button>
        )}
        </div>
        

        
      </div>
    </div>
  );
}
