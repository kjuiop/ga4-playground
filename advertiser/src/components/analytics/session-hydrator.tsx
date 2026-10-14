"use client";

import { useEffect } from "react";
import { setSession, type ClientAccount } from "@/lib/auth/session-store";

export function SessionHydrator({ account }: { account: ClientAccount | null }) {
  useEffect(() => {
    setSession(account);
  }, [account]);
  return null;
}
