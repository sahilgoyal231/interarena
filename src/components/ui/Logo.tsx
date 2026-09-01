// src/components/ui/Logo.tsx

"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function InterArenaLogo({ className = "w-48 h-auto" }: { className?: string }) {
  return (
    <div className={`relative flex items-center group cursor-pointer ${className}`}>
      <svg 
        viewBox="0 0 200 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="InterArena Logo"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" /> {/* Pink 400 */}
            <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia 500 */}
          </linearGradient>
          <linearGradient id="leftLegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" /> {/* Purple 400 */}
            <stop offset="100%" stopColor="#7e22ce" /> {/* Purple 700 */}
          </linearGradient>
          <linearGradient id="rightLegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" /> {/* Blue 400 */}
            <stop offset="100%" stopColor="#4c1d95" /> {/* Purple 900 */}
          </linearGradient>
          <linearGradient id="crossbarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d8b4fe" /> {/* Purple 300 */}
          </linearGradient>
        </defs>

        <g transform="translate(0, 0)">
          {/* Subtle staggered entrance animation */}
          
          {/* Right Leg */}
          <motion.rect 
            x="26" y="13" width="8" height="30" rx="4" 
            transform="rotate(25 30 27)" 
            fill="url(#rightLegGrad)" 
            opacity="0.95"
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 0.95, y: 0, rotate: 25 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Left Leg */}
          <motion.rect 
            x="16" y="13" width="8" height="30" rx="4" 
            transform="rotate(-25 20 27)" 
            fill="url(#leftLegGrad)" 
            opacity="0.95"
            style={{ mixBlendMode: "screen" }}
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 0.95, y: 0, rotate: -25 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          />
          
          {/* Crossbar */}
          <motion.rect 
            x="13" y="30" width="24" height="8" rx="4" 
            fill="url(#crossbarGrad)" 
            opacity="0.95"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.95, scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          />

          {/* The Human Spark (Floating Dot) */}
          <motion.circle 
            cx="25" cy="6" r="4.5" 
            fill="url(#dotGrad)" 
            initial={{ opacity: 0, scale: 0, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              opacity: { duration: 0.5, delay: 0.5 },
              scale: { duration: 0.5, delay: 0.5 }
            }}
            whileHover={{ scale: 1.2, filter: "brightness(1.2)" }}
          />
        </g>

        {/* Typography */}
        <motion.text 
          x="55" 
          y="35" 
          className="font-sans font-black tracking-tight"
          fontSize="30" 
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <tspan fill="#ffffff">Inter</tspan>
          <tspan fill="#a855f7">Arena</tspan>
        </motion.text>
      </svg>
    </div>
  );
}