import { useContext } from "react";
import { AuthStatusContext } from "./Web3Provider";

export function useAmuletAuthStatus() {
  return useContext(AuthStatusContext);
}
