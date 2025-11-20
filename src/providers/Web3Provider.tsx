/* eslint-disable react-refresh/only-export-components */
import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
} from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { createSiweAdapter } from "../auth/siwe";
import type { AuthStatus } from "../auth/siwe";

export const AuthStatusContext = createContext<AuthStatus>("loading");

const queryClient = new QueryClient();

const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  // Load SIWE session
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/siwe/me", { credentials: "include" });
        const json = await res.json();
        setAuthStatus(json.address ? "authenticated" : "unauthenticated");
      } catch {
        setAuthStatus("unauthenticated");
      }
    })();
  }, []);

  const siweAdapter = useMemo(
    () => createSiweAdapter(setAuthStatus),
    []
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthStatusContext.Provider value={authStatus}>
          <RainbowKitAuthenticationProvider
            adapter={siweAdapter}
            status={authStatus}
          >
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </AuthStatusContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
