"use client";

import React, { useState, useEffect } from "react";
import { Timer, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalTimerProps {
  initialMinutes: number;
}

export function GlobalTimer({ initialMinutes }: GlobalTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(initialMinutes * 60);
      setIsExpired(false);
    }, 0);
  }, [initialMinutes]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isExpired) {
        setTimeout(() => setIsExpired(true), 0);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const isWarning = timeLeft > 0 && timeLeft <= 300; // last 5 minutes

  return (
    <div
      className={cn(
        "flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm font-bold font-mono transition-all duration-500",
        isExpired
          ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
          : isWarning
            ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
            : "bg-zinc-900 border-zinc-700 text-zinc-100",
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={isExpired ? "expired" : "running"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isExpired ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Timer className="w-4 h-4" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="w-14 text-center tabular-nums tracking-widest">
        {isExpired ? "00:00" : formattedTime}
      </span>
    </div>
  );
}
