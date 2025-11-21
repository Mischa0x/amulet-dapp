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
import { ConnectButton } from '@rainbow-me/rainbowkit';
import "./Dashboard.css";

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

    setRecipient("");
    setAmount("");
  };

  const shortAddr =
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const seiBalanceFormatted =
    seiBalance && seiBalance.value ? formatEther(seiBalance.value) : null;

  const amuletBalanceFormatted =
    amuletBalance && typeof amuletBalance === "bigint"
      ? formatEther(amuletBalance)
      : null;

  // Not connected state: same shell/card, but just onboarding + connect button
  if (!isConnected) {
    return (
      <div className="dashboardShell">
        <div className="dashboardCard">
          <div className="dashboardHeader">
            <div className="dashboardHeaderText">
              <h1 className="dashboardBrand">Amulet Dashboard</h1>
              <p className="dashboardTagline">
                Connect your Sei Testnet wallet to manage AMULET.
              </p>
            </div>

            <ConnectButton/>



          </div>

          <p className="dashboardValue">
            Once connected, you’ll see your SEI and AMULET balances, token
            details, and be able to send AMULET.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardShell">
      <div className="dashboardCard">
        {/* Header: brand + Connect Wallet */}
        <div className="dashboardHeader">
          <div className="dashboardHeaderText">
            <h1 className="dashboardBrand">Amulet Dashboard</h1>
            <p className="dashboardTagline">
              Overview of your wallet and AMULET token on Sei Testnet.
            </p>
          </div>
          <ConnectButton />
        </div>

        {/* Grid: wallet + balances + token info */}
        <div className="dashboardGrid">
          <section className="dashboardSection">
            <h3 className="dashboardSectionTitle">Wallet</h3>
            <p className="dashboardLabel">Address</p>
            <p className="dashboardValue dashboardValueMono">{shortAddr}</p>

            <p className="dashboardLabel">Network</p>
            <p className="dashboardValue">
              Sei Testnet (chainId {chainId})
            </p>
          </section>

          <section className="dashboardSection">
            <h3 className="dashboardSectionTitle">SEI Balance</h3>
            <p className="dashboardLabel">Balance</p>
            <p className="dashboardValue">
              {seiBalanceFormatted ? `${seiBalanceFormatted} SEI` : "…"}
            </p>
            <p className="dashboardLabel">Usage</p>
            <p className="dashboardValue">Used as gas for transactions.</p>
          </section>

          <section className="dashboardSection">
            <h3 className="dashboardSectionTitle">AMULET Balance</h3>
            <p className="dashboardLabel">Balance</p>
            <p className="dashboardValue">
              {amuletBalanceFormatted && symbol
                ? `${amuletBalanceFormatted} ${symbol as string}`
                : "…"}
            </p>
            <p className="dashboardLabel">Token</p>
            <p className="dashboardValue">{name as string}</p>
          </section>

          <section className="dashboardSection">
            <h3 className="dashboardSectionTitle">Token Info</h3>

            <p className="dashboardLabel">Name</p>
            <p className="dashboardValue">
              {(name as string) ?? "Loading…"}
            </p>

            <p className="dashboardLabel">Symbol</p>
            <p className="dashboardValue">
              {(symbol as string) ?? "..."}
            </p>

            <p className="dashboardLabel">Total Supply</p>
            <p className="dashboardValue">
              {totalSupplyFormatted
                ? `${totalSupplyFormatted} ${symbol as string}`
                : "…"}
            </p>

            <p className="dashboardLabel">Decimals</p>
            <p className="dashboardValue">
              {typeof decimals === "number" ? decimals : "…"}
            </p>

            <p className="dashboardLabel">Contract</p>
            <p className="dashboardValue dashboardValueMono">
              {TOKEN_CONTRACT_ADDRESS.slice(0, 10)}...
              {TOKEN_CONTRACT_ADDRESS.slice(-6)}
            </p>

            <a
              className="dashboardLink"
              href={`https://testnet.seiscan.io/address/${TOKEN_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Seiscan
            </a>
          </section>
        </div>

        {/* Second row: send + activity */}
        <div className="dashboardGrid">
          <section className="dashboardSection">
            <h3 className="dashboardSectionTitle">Send AMULET</h3>

            <div className="dashboardForm">
              <div className="dashboardField">
                <label className="dashboardLabel">Recipient</label>
                <input
                  className="dashboardInput"
                  type="text"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="dashboardField">
                <label className="dashboardLabel">Amount (AMULET)</label>
                <input
                  className="dashboardInput"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <button
                className="dashboardPrimaryButton"
                onClick={handleTransfer}
                disabled={isSending || isConfirming || !amount || !recipient}
              >
                {isSending
                  ? "Sending…"
                  : isConfirming
                  ? "Waiting for confirmation…"
                  : "Send AMULET"}
              </button>

              {error && (
                <p className="dashboardError">
                  Error: {(error as Error).message}
                </p>
              )}
            </div>
          </section>

          <section className="dashboardSection">
            <h3 className="dashboardSectionTitle">Recent Activity</h3>

            {!txHash && (
              <p className="dashboardValue">
                No transactions sent yet. Your next AMULET transfer will
                appear here.
              </p>
            )}

            {txHash && (
              <>
                <p className="dashboardLabel">Last transaction</p>
                <p className="dashboardValue dashboardValueMono">
                  {txHash.slice(0, 12)}...{txHash.slice(-8)}
                </p>

                <p className="dashboardLabel">Status</p>
                <p className="dashboardValue">
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
                  className="dashboardLink"
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
      </div>
    </div>
  );
}

export default Dashboard;
