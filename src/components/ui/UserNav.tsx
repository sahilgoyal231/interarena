"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function UserNav() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded || !user) return <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`block w-10 h-10 rounded-full overflow-hidden border-2 transition-colors shadow-sm cursor-pointer outline-none ${isOpen ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-zinc-800 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
      </button>
      
      {/* Dropdown Menu */}
      <div className={`absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}>
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
          <p className="text-sm font-bold text-white truncate">{user.fullName || user.username || "User"}</p>
          <p className="text-xs text-zinc-500 truncate mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="p-2 flex flex-col gap-1 bg-zinc-950">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors">
            <User className="w-4 h-4 text-purple-400" /> System Profile
          </Link>
          <button 
            onClick={() => {
              setIsOpen(false);
              signOut({ redirectUrl: '/' });
            }} 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left outline-none"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
