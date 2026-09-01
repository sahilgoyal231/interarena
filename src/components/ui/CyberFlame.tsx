import React from 'react';

export function CyberFlame({ className = "" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      {/* Organic flame aura - representing the 'heat' of the streak */}
      <path 
        d="M12 1.5C12 1.5 5 9.5 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 12 15 7 15 7L15.5 10C15.5 10 13.5 8.5 12 1.5Z" 
        fill="currentColor" 
        fillOpacity="0.25"
      />
      {/* Sharp digital lightning core - representing the tech/coding aspect */}
      <path 
        d="M11 4.5L6.5 13H10.5L8.5 20.5L16.5 11H12.5L14.5 4.5H11Z" 
        fill="currentColor" 
      />
    </svg>
  );
}
