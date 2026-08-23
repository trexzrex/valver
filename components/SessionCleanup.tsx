"use client";

import { useEffect } from "react";

export function SessionCleanup() {
  useEffect(() => {
    sessionStorage.removeItem("valver-id-fields");
    document.cookie = "valver_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }, []);

  return null;
}