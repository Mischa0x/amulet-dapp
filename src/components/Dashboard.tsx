// src/components/Dashboard.tsx
import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther, formatUnits } from "viem";
import { ERC20_ABI, TOKEN_CONTRACT_ADDRESS } from "../shared/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";


import "@rainbow-me/rainbowkit/styles.css";

export function Dashboard() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Native SEI balance
  const { data: seiBalance } = useBalance({
    address,
    chainId,
    query: { enabled: !!address },
  });

  // Token metadata
  const { data: name } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const { data: totalSupply } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "totalSupply",
  });

  const totalSupplyFormatted =
    totalSupply && typeof totalSupply === "bigint" && typeof decimals === "number"
      ? formatUnits(totalSupply, decimals)
      : null;

  // AMULET balance
  const {
    data: amuletBalance,
    refetch: refetchAmuletBalance,
  } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Write / send AMULET
  const {
    writeContract,
    data: txHash,
    isPending: isSending,
    error,
  } = useWriteContract();

  // Wait for tx confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Refetch AMULET balance when tx confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchAmuletBalance();
    }
  }, [isConfirmed, refetchAmuletBalance]);

  const handleTransfer = () => {
    if (!recipient || !amount) return;

    writeContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [recipient as `0x${string}`, parseEther(amount)],
    });

    // Clear form after submitting
    setRecipient("");
    setAmount("");
  };

  if (!isConnected) {
    return (
      <div>
        <h2>Welcome to Amulet AI</h2>
 
        <p>
          Use the <strong>Connect Wallet</strong> button to link your Sei Testnet
          wallet and view your AMULET dashboard.
        </p>
      </div>
    );
  }

  const shortAddr =
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const seiBalanceFormatted =
    seiBalance && seiBalance.value ? formatEther(seiBalance.value) : null;

  const amuletBalanceFormatted =
    amuletBalance && typeof amuletBalance === "bigint"
      ? formatEther(amuletBalance)
      : null;

  return (
    <div>
      <section>

                 <div>
      <ConnectButton />
    </div>
        <h3>Wallet</h3>
        <p>Address:</p>
        <p>{shortAddr}</p>

        <p>Network:</p>
        <p>Sei Testnet (chainId {chainId})</p>
      </section>

      <section>
        <h3>SEI Balance</h3>
        <p>{seiBalanceFormatted ? `${seiBalanceFormatted} SEI` : "…"}</p>
        <p>Used as gas for transactions.</p>
      </section>

      <section>
        <h3>AMULET Balance</h3>
        <p>
          {amuletBalanceFormatted && symbol
            ? `${amuletBalanceFormatted} ${symbol as string}`
            : "…"}
        </p>
        <p>{name as string}</p>
      </section>

      <section>
        <h3>Token Info</h3>

        <p>Name:</p>
        <p>{(name as string) ?? "Loading…"}</p>

        <p>Symbol:</p>
        <p>{(symbol as string) ?? "..."}</p>

        <p>Total Supply:</p>
        <p>
          {totalSupplyFormatted
            ? `${totalSupplyFormatted} ${symbol as string}`
            : "…"}
        </p>

        <p>Decimals:</p>
        <p>{typeof decimals === "number" ? decimals : "…"}</p>

        <p>Contract:</p>
        <p>
          {TOKEN_CONTRACT_ADDRESS.slice(0, 10)}...
          {TOKEN_CONTRACT_ADDRESS.slice(-6)}
        </p>

        <a
          href={`https://testnet.seiscan.io/address/${TOKEN_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Seiscan
        </a>
      </section>

      <section>
        <h3>Send AMULET</h3>

        <label>Recipient</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <label>Amount (AMULET)</label>
        <input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleTransfer}
          disabled={isSending || isConfirming || !amount || !recipient}
        >
          {isSending
            ? "Sending…"
            : isConfirming
            ? "Waiting for confirmation…"
            : "Send AMULET"}
        </button>

        {error && <p>Error: {(error as Error).message}</p>}
      </section>

      <section>
        <h3>Recent Activity</h3>

        {!txHash && (
          <p>
            No transactions sent yet. Your next AMULET transfer will appear
            here.
          </p>
        )}

        {txHash && (
          <>
            <p>Last transaction:</p>
            <p>
              {txHash.slice(0, 12)}...{txHash.slice(-8)}
            </p>

            <p>Status:</p>
            <p>
              {isSending
                ? "Sending…"
                : isConfirming
                ? "Confirming…"
                : isConfirmed
                ? "Confirmed ✅"
                : isTxError
                ? "Failed ❌"
                : "Confirmed ✅"}
            </p>

            <a
              href={`https://testnet.seiscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Seiscan
            </a>
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
