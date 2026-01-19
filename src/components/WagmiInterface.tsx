// src/components/WagmiInterface.tsx
import { useState, useEffect } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ERC20_ABI, TOKEN_CONTRACT_ADDRESS } from '../shared/constants.js';

export function WagmiInterface() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const { address, isConnected } = useAccount();

  // Read token metadata
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

  // Read balance of connected address
  const {
    data: balance,
    refetch: refetchBalance,
  } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write / send tokens
  const {
    writeContract,
    data: txHash,
    isPending: isSending,
    error,
  } = useWriteContract();

  // Track confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // After confirmation, clean up & refresh balance once
// AFTER – only side-effect is refetching from chain
useEffect(() => {
  if (isConfirmed) {
    refetchBalance();
  }
}, [isConfirmed, refetchBalance]);


  const handleTransfer = () => {
    if (!recipient || !amount) return;
    writeContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, parseEther(amount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="card">
        <h2>Amulet AI – AMULET Token</h2>
        <p style={{ opacity: 0.8 }}>
          Connect your wallet using the button in the top-right to see your
          AMULET balance and send tokens.
        </p>
      </div>
    );
  }

  const shortAddr =
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="card">
      <h2>Amulet AI – AMULET Token</h2>

      <h3>
        {(name as string) ?? 'Loading'} ({(symbol as string) ?? '...'})
      </h3>

      <p>Connected: {shortAddr}</p>
      <p>
        Balance:{' '}
        {balance ? `${formatEther(balance as bigint)} ${symbol as string}` : '…'}
      </p>

      <div style={{ marginTop: 20 }}>
        <label style={{ fontSize: 12, opacity: 0.8 }}>Recipient</label>
        <br />
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ width: 320, marginBottom: 10 }}
        />
        <br />

        <label style={{ fontSize: 12, opacity: 0.8 }}>Amount (AMULET)</label>
        <br />
        <input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: 320, marginBottom: 10 }}
        />
        <br />

        <button
          onClick={handleTransfer}
          disabled={isSending || isConfirming}
        >
          {isSending
            ? 'Sending…'
            : isConfirming
            ? 'Waiting for confirmation…'
            : 'Send AMULET'}
        </button>

        {txHash && (
          <p style={{ marginTop: 8 }}>
            Tx:{' '}
            <a
              href={`https://testnet.seiscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Seiscan
            </a>
          </p>
        )}

        {error && (
          <p style={{ color: 'red', marginTop: 8 }}>
            Error: {(error as Error).message}
          </p>
        )}
      </div>
    </div>
  );
}
