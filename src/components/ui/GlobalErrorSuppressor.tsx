"use client";

import { useEffect } from "react";

export function GlobalErrorSuppressor() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      // Suppress Clerk UI/JS loading errors from triggering the Next.js Red Overlay
      if (
        args[0] &&
        typeof args[0] === "string" &&
        (args[0].includes("Failed to load Clerk") ||
          args[0].includes("ClerkRuntimeError"))
      ) {
        return; // Silently drop it
      }

      // Also suppress Error objects that have this message
      if (
        args[0] &&
        args[0].message &&
        args[0].message.includes("Failed to load Clerk")
      ) {
        return;
      }

      originalError(...args);
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason &&
        e.reason.message &&
        e.reason.message.includes("Failed to load Clerk")
      ) {
        e.preventDefault(); // Stop the red overlay for unhandled rejections
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
