// src/providers/Web3Provider.tsx
import React, { useEffect, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { createSiweAdapter } from "../auth/siwe";
import type { AuthStatus } from "../auth/siwe";
import { authStatusContext } from "./authStatusContext"; // ✅ moved to separate file

const queryClient = new QueryClient();

// Same base URL used by your SIWE adapter
const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://siwe-server.vercel.app"
    : "";

type Props = {
  children: React.ReactNode;
};

const Web3Provider: React.FC<Props> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  //
  // 🔹 Check existing SIWE session on mount
  //
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/siwe/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error(
            "SIWE: /me failed:",
            res.status,
            await res.text().catch(() => "")
          );
          setAuthStatus("unauthenticated");
          return;
        }

        const json = await res.json();
        setAuthStatus(json.address ? "authenticated" : "unauthenticated");
      } catch (err) {
        console.error("SIWE: /me error:", err);
        setAuthStatus("unauthenticated");
      }
    })();
  }, []);

  //
  // 🔹 Build the SIWE adapter only once
  //
  const siweAdapter = useMemo(
    () => createSiweAdapter(setAuthStatus),
    [] // setAuthStatus is stable
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <authStatusContext.Provider value={authStatus}>
          <RainbowKitAuthenticationProvider
            adapter={siweAdapter}
            status={authStatus}
          >
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </authStatusContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
