"use client";
import { motion } from "framer-motion";

export const TechSuitesLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Outer Hexagon */}
        <motion.path 
            d="M50 5 L90 28 V72 L50 95 L10 72 V28 Z" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "circOut" }}
        />
        {/* Inner Y shape (Isometric cube edges) */}
        <motion.path 
            d="M50 50 V95 M50 50 L10 28 M50 50 L90 28" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
        />
        {/* Inner floating core */}
        <motion.polygon 
            points="50,25 70,38 70,62 50,75 30,62 30,38" 
            fill="currentColor"
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 0.2, rotate: 0 }}
            transition={{ duration: 1, delay: 1, type: "spring", stiffness: 200 }}
            style={{ transformOrigin: "50px 50px" }}
        />
        {/* Pulsing center node */}
        <motion.circle 
            cx="50" 
            cy="50" 
            r="8" 
            fill="currentColor" 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 1.5, duration: 0.5 }}
        />
        {/* Orbiting particles */}
        <motion.circle 
            cx="50" cy="5" r="3" fill="currentColor"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.circle 
            cx="90" cy="72" r="3" fill="currentColor"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
        <motion.circle 
            cx="10" cy="72" r="3" fill="currentColor"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        />
    </svg>
);
