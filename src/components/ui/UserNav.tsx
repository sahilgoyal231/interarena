"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

export function UserNav() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded || !user) return <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />;

  return (
    <div className="relative group">
      <Link href="/profile" className="block w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-purple-500 transition-colors shadow-sm group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
      </Link>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
          <p className="text-sm font-bold text-white truncate">{user.fullName || user.username || "User"}</p>
          <p className="text-xs text-zinc-500 truncate mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="p-2 flex flex-col gap-1 bg-zinc-950">
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors">
            <User className="w-4 h-4 text-purple-400" /> System Profile
          </Link>
          <button 
            onClick={() => signOut({ redirectUrl: '/' })} 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left outline-none"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
