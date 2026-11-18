"use client";

import { useEffect } from "react";

export function SessionCleanup() {
  useEffect(() => {
    sessionStorage.removeItem("valver-id-fields");
    // The server clears the HttpOnly cookie on the home response.
  }, []);

  return null;
}