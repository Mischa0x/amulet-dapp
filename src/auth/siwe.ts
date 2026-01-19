// src/auth/siwe.ts
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";

export type AuthStatus = "loading" | "unauthenticated" | "authenticated";

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
      const res = await fetch(`${API_BASE}/api/siwe/nonce`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Nonce request failed: ${res.status}`);
      }

      return res.text();
    },

    createMessage: ({ nonce, address, chainId }: CreateMessageArgs): string => {
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
      const res = await fetch(`${API_BASE}/api/siwe/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      });

      if (!res.ok) {
        setStatus("unauthenticated");
        return false;
      }

      setStatus("authenticated");
      return true;
    },

    signOut: async (): Promise<void> => {
      try {
        await fetch(`${API_BASE}/api/siwe/logout`, {
          method: "POST",
          credentials: "include",
        });
      } finally {
        setStatus("unauthenticated");
      }
    },
  });
}
