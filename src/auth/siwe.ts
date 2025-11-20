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
      console.log("SIWE: getNonce →", API_BASE || "(dev local)");

      const res = await fetch(`${API_BASE}/api/siwe/nonce`, {
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("SIWE: getNonce FAILED", res.status, text);
        throw new Error(`Nonce request failed: ${res.status}`);
      }

      const nonce = await res.text();
      console.log("SIWE: getNonce result →", nonce);
      return nonce;
    },

    createMessage: ({ nonce, address, chainId }: CreateMessageArgs): string => {
      try {
        console.log("SIWE: createMessage args →", { nonce, address, chainId });

        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in to AMULET.AI",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });

        const prepared = message.prepareMessage();
        console.log("SIWE: prepared message →", prepared);
        return prepared;
      } catch (err) {
        console.error("SIWE: createMessage ERROR →", err);
        throw err;
      }
    },

    verify: async ({ message, signature }: VerifyArgs): Promise<boolean> => {
      console.log("SIWE: verify args →", { message, signature });

      const res = await fetch(`${API_BASE}/api/siwe/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("SIWE: verify FAILED", res.status, text);
        setStatus("unauthenticated");
        return false;
      }

      console.log("SIWE: verify success");
      setStatus("authenticated");
      return true;
    },

    signOut: async (): Promise<void> => {
      console.log("SIWE: signOut");

      try {
        const res = await fetch(`${API_BASE}/api/siwe/logout`, {
          method: "POST",
          credentials: "include",
        });
        console.log("SIWE: signOut status →", res.status);
      } catch (err) {
        console.error("SIWE: signOut ERROR →", err);
      } finally {
        setStatus("unauthenticated");
      }
    },
  });
}
