// src/providers/AuthStatusContext.ts
import { createContext } from "react";
import type { AuthStatus } from "../auth/siwe";

// Global auth status context used across the app
export const authStatusContext = createContext<AuthStatus>("loading");
