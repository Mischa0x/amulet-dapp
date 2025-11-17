// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ERC20_ABI, TOKEN_CONTRACT_ADDRESS } from '../shared/constants';

export function Dashboard() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

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
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  // AMULET balance
  const {
    data: amuletBalance,
    refetch: refetchAmuletBalance,
  } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
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
      functionName: 'transfer',
      args: [recipient as `0x${string}`, parseEther(amount)],
    });

    // Clear form after submitting
    setRecipient('');
    setAmount('');
  };

  if (!isConnected) {
    return (
      <div className="dashboard">
        <div className="dashboard-card dashboard-card-large">
          <h2>Welcome to Amulet AI</h2>
          <p className="muted">
            Use the <strong>Connect Wallet</strong> button in the top-right to
            link your Sei Testnet wallet and view your AMULET dashboard.
          </p>
        </div>
      </div>
    );
  }

  const shortAddr =
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const seiBalanceFormatted =
    seiBalance && seiBalance.value
      ? formatEther(seiBalance.value)
      : null;

  const amuletBalanceFormatted =
    amuletBalance && typeof amuletBalance === 'bigint'
      ? formatEther(amuletBalance)
      : null;

  return (
    <div className="dashboard">
      {/* Top row: wallet overview */}
      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Wallet</h3>
          <p className="label">Address</p>
          <p className="mono">{shortAddr}</p>

          <p className="label">Network</p>
          <p>Sei Testnet (chainId {chainId})</p>
        </div>

        <div className="dashboard-card">
          <h3>SEI Balance</h3>
          <p className="big">
            {seiBalanceFormatted ? `${seiBalanceFormatted} SEI` : '…'}
          </p>
          <p className="muted">Used as gas for transactions</p>
        </div>

        <div className="dashboard-card">
          <h3>AMULET Balance</h3>
          <p className="big">
            {amuletBalanceFormatted && symbol
              ? `${amuletBalanceFormatted} ${symbol as string}`
              : '…'}
          </p>
          <p className="muted">{name as string}</p>
        </div>
      </section>

      {/* Second row: send + activity */}
      <section className="dashboard-grid">
        <div className="dashboard-card dashboard-card-tall">
          <h3>Send AMULET</h3>

          <label className="label">Recipient</label>
          <input
            className="input"
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <label className="label">Amount (AMULET)</label>
          <input
            className="input"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={handleTransfer}
            disabled={isSending || isConfirming || !amount || !recipient}
          >
            {isSending
              ? 'Sending…'
              : isConfirming
              ? 'Waiting for confirmation…'
              : 'Send AMULET'}
          </button>

          {error && (
            <p className="error">
              Error: {(error as Error).message}
            </p>
          )}
        </div>

      {/* Recent Activity card */}
<div className="dashboard-card dashboard-card-tall">
  <h3>Recent Activity</h3>

  {!txHash && (
    <p className="muted">
      No transactions sent yet. Your next AMULET transfer will appear
      here.
    </p>
  )}

  {txHash && (
    <>
      <p className="label">Last transaction</p>
      <p className="mono small">
        {txHash.slice(0, 12)}...{txHash.slice(-8)}
      </p>

      <p className="label">Status</p>
      <p>
        {isSending
          ? 'Sending…'
          : isConfirming
          ? 'Confirming…'
          : isConfirmed
          ? 'Confirmed ✅'
          : isTxError
          ? 'Failed ❌'
          : 'Confirmed ✅'}
      </p>

      <a
        className="link"
        href={`https://testnet.seiscan.io/tx/${txHash}`}
        target="_blank"
        rel="noreferrer"
      >
        View on Seiscan
      </a>
    </>
  )}
</div>

      </section>
    </div>
  );
}
