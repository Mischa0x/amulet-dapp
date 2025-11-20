// src/auth/siwe.ts
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";

export type AuthStatus = "loading" | "unauthenticated" | "authenticated";

// Point frontend → Vercel backend in production
const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://siwe-server.vercel.app"
    : "";

interface CreateMessageArgs {
  nonce: string;
  address: string;
  chainId: number;
}

interface VerifyArgs {
  message: string;
  signature: string;
}

export function createSiweAdapter(setStatus: (status: AuthStatus) => void) {
  return createAuthenticationAdapter({
    getNonce: async (): Promise<string> => {
      console.log("SIWE: getNonce");
      const res = await fetch(`${API_BASE}/api/siwe/nonce`, {
        credentials: "include",
      });
      return res.text();
    },

    createMessage: ({ nonce, address, chainId }: CreateMessageArgs): string => {
      console.log("SIWE: createMessage", { nonce, address, chainId });
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to AMULET.AI",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      return message.prepareMessage();
    },

    verify: async ({ message, signature }: VerifyArgs): Promise<boolean> => {
      console.log("SIWE: verify", { message, signature });

      const res = await fetch(`${API_BASE}/api/siwe/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      });

      const ok = res.ok;
      setStatus(ok ? "authenticated" : "unauthenticated");
      return ok;
    },

    signOut: async (): Promise<void> => {
      console.log("SIWE: signOut");

      await fetch(`${API_BASE}/api/siwe/logout`, {
        method: "POST",
        credentials: "include",
      });

      setStatus("unauthenticated");
    },
  });
}
