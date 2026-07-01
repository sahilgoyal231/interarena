// src/components/ui/Logo.tsx

export default function InterArenaLogo({ className = "w-48 h-auto" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 240 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="InterArena Logo"
    >
      <defs>
        {/* The rich glowing gradient for the Terminal Cursor and "Arena" text */}
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" /> {/* Tailwind purple-400 */}
          <stop offset="100%" stopColor="#9333ea" /> {/* Tailwind purple-600 */}
        </linearGradient>

        {/* Custom blur filter to create the "glowing" neon effect behind the cursor */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform="translate(4, 4)">
        {/* 1. The Arena Boundary (Right Pillar - Deep Muted Purple) 
            Represents the high-pressure enclosure of the MOAs */}
        <path 
          d="M 28 6 L 42 36" 
          stroke="#4c1d95" /* Tailwind purple-900 */
          strokeWidth="6" 
          strokeLinecap="round" 
        />

        {/* 2. The Foundation (Left Pillar - Crisp White)
            Represents the structured logic of Aptitude & Verbal */}
        <path 
          d="M 22 6 L 8 36" 
          stroke="#ffffff" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />

        {/* 3. The Execution (The Crossbar / Terminal Cursor)
            Represents the Code Sandbox and the ticking Time-limit.
            Notice how it pierces through the 'A' and extends toward the wordmark. */}
        
        {/* Background ambient glow for the cursor */}
        <path 
          d="M 11 25 L 48 25" 
          stroke="#a855f7" 
          strokeWidth="6" 
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#neonGlow)"
        />
        
        {/* Core solid cursor */}
        <path 
          d="M 11 25 L 48 25" 
          stroke="url(#primaryGradient)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
      </g>

      {/* The Typography: Classic, tightly-tracked, and perfectly weighted for SaaS */}
      <text 
        x="64" 
        y="36" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="28" 
        fontWeight="800" 
        letterSpacing="-0.5"
      >
        <tspan fill="#ffffff">Inter</tspan>
        <tspan fill="url(#primaryGradient)">Arena</tspan>
      </text>
    </svg>
  );
}