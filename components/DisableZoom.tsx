"use client";

import { useEffect } from "react";

export function DisableZoom() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      const originalContent = viewport.getAttribute("content");
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      );

      return () => {
        if (originalContent) {
          viewport.setAttribute("content", originalContent);
        }
      };
    }
  }, []);

  return null;
}