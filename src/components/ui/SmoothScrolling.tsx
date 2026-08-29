"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 0.8, syncTouch: true }}>
      <ScrollRestorer />
      {children}
    </ReactLenis>
  );
}

function ScrollRestorer() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // Force Lenis to recalculate bounds and reset to top when navigating routes
      lenis.stop();
      lenis.start();
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}
