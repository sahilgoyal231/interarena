"use client";
import { motion } from "framer-motion";

export const AptSprintsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.path 
            d="M25 20 L75 20 L50 50 L75 80 L25 80 L50 50 Z" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.circle cx="50" cy="50" r="6" fill="currentColor" 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path d="M35 35 L65 35 M35 65 L65 65" stroke="currentColor" strokeWidth="3"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
    </svg>
);

export const VerbalLeaguesLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.line x1="50" y1="20" x2="50" y2="85" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
            initial={{ height: 0 }} animate={{ height: 65 }} transition={{ duration: 1 }}
        />
        <motion.path d="M50 20 C 25 5, 10 20, 10 20 L 10 85 C 10 85, 25 70, 50 85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
        />
        <motion.path d="M50 20 C 75 5, 90 20, 90 20 L 90 85 C 90 85, 75 70, 50 85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
        />
        {[35, 50, 65].map((y, i) => (
            <motion.line key={`l-${i}`} x1="25" y1={y} x2="40" y2={y} stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 + i * 0.2 }} />
        ))}
        {[35, 50, 65].map((y, i) => (
            <motion.line key={`r-${i}`} x1="60" y1={y} x2="75" y2={y} stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 + i * 0.2 }} />
        ))}
    </svg>
);

export const CodeSandboxLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.path d="M35 25 L15 50 L35 75" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}
        />
        <motion.path d="M65 25 L85 50 L65 75" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}
        />
        <motion.rect x="42" y="35" width="16" height="6" rx="2" fill="currentColor"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }} />
        <motion.rect x="42" y="50" width="10" height="6" rx="2" fill="currentColor"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }} />
        <motion.rect x="42" y="65" width="16" height="6" rx="2" fill="currentColor"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.4 }} />
        <motion.rect x="55" y="50" width="5" height="6" fill="currentColor"
            animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
    </svg>
);

export const DesignDraftsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.path d="M50 10 L75 25 L50 40 L25 25 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} />
        <motion.path d="M20 45 L40 57 L20 69 L0 57 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
        <motion.path d="M80 45 L100 57 L80 69 L60 57 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
        <motion.path d="M50 70 L75 85 L50 100 L25 85 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
        <motion.path d="M40 33 L30 50 M60 33 L70 50 M30 63 L40 80 M70 63 L60 80" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 }} />
    </svg>
);

export const PromptTrialsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Isometric Platform / Terminal Plane */}
        <motion.path d="M10 60 L50 40 L90 60 L50 80 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} />
            
        {/* Terminal Prompt symbol ">_" in 3D projection on the plane */}
        <motion.path d="M35 55 L45 60 L35 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
        <motion.line x1="50" y1="68" x2="65" y2="60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
            
        {/* Floating Spark (The LLM Output / Magic) */}
        <motion.path d="M50 5 L55 20 L70 25 L55 30 L50 45 L45 30 L30 25 L45 20 Z" fill="currentColor"
            initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 1, delay: 1, type: "spring" }} />
            
        {/* Concentric rings radiating from the spark */}
        <motion.ellipse cx="50" cy="25" rx="25" ry="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: [0, 0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }} />
        <motion.ellipse cx="50" cy="25" rx="15" ry="6" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: [0, 0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 2 }} />

        {/* Connecting Data Beam */}
        <motion.line x1="50" y1="40" x2="50" y2="45" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"
            animate={{ y: [0, -5], opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
    </svg>
);

export const GenAIVectorsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.circle cx="50" cy="50" r="10" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="15" cy="25" r="5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
        <motion.circle cx="85" cy="25" r="5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
        <motion.circle cx="15" cy="75" r="5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
        <motion.circle cx="85" cy="75" r="5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} />
        
        <motion.path d="M19 29 L43 45 M81 29 L57 45 M19 71 L43 55 M81 71 L57 55 M15 30 L15 70 M85 30 L85 70 M20 25 L80 25 M20 75 L80 75" 
            stroke="currentColor" strokeWidth="3" opacity="0.3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1 }} />
            
        <motion.line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6"
            animate={{ y: [0, -30, 30, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
    </svg>
);
