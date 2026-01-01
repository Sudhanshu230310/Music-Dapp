"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Navbar() {
  const islogin = useSession();
  const router=useRouter();
  console.log(islogin);
  useEffect(()=>{
    if(islogin.status=="authenticated"){
      router.push("Dashboard")
    }
    else{
      router.push("/")
    }
  },[islogin.status])
  return (
    <div className="z-10 h-20 flex justify-between items-center px-6 py-2 text-lg sticky top-0 bg-black text-white border-b border-gray-400">
      <div className="font-bold text-3xl font-serif">Muzi</div>
      <div className="text-white">
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
  );
}
