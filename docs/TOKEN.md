# AMULET Token

## Overview

AMULET is the native utility token of the Amulet AI platform, deployed on the Sei blockchain. It provides holders with discounted access to compute credits and future governance rights.

## Token Details

| Property | Value |
|----------|-------|
| **Name** | AMULET AI |
| **Symbol** | AMULET |
| **Decimals** | 18 |
| **Network** | Sei Testnet (Atlantic-2) |
| **Contract** | `0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c` |
| **Standard** | ERC-20 |

## Token Utility

### 1. Credit Staking (2x Value)
Users can stake AMULET tokens to receive compute credits at 2x the fiat rate:

| Method | Rate |
|--------|------|
| Fiat Purchase | 1 credit = $0.05 |
| AMULET Staking | 1 AMULET = 20 credits (effectively $0.025/credit) |

### 2. Platform Access
- Priority AI model access
- Early feature releases
- Community governance (future)

### 3. Staking Mechanics (Planned)
- **Lock Period:** 12 months
- **Credit Conversion:** 20 credits per 1 AMULET staked
- **Credit Expiration:** 12 months from stake date
- **Unstaking:** Available after lock period

## Smart Contract Integration

### ERC-20 ABI (Minimal)

```javascript
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];
```

### Staking Contract ABI (Planned)

```javascript
const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getStakeInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'stakedAt', type: 'uint256' },
      { name: 'creditsGranted', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
];
```

## Frontend Integration

### Reading Token Balance

```jsx
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

const AMULET_CONTRACT = '0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c';

function TokenBalance({ address }) {
  const { data: balance } = useReadContract({
    address: AMULET_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  const formatted = balance
    ? parseFloat(formatUnits(balance, 18)).toFixed(2)
    : '0.00';

  return <span>{formatted} AMULET</span>;
}
```

### Staking Flow (Planned)

```jsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';

function StakeForm() {
  const [amount, setAmount] = useState('');
  const { writeContract: approve, data: approveTxHash } = useWriteContract();
  const { writeContract: stake, data: stakeTxHash } = useWriteContract();

  const handleStake = async () => {
    const amountWei = parseUnits(amount, 18);

    // Step 1: Approve staking contract
    approve({
      address: AMULET_CONTRACT,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [STAKING_CONTRACT, amountWei],
    });
  };

  // Step 2: After approval, call stake()
  useEffect(() => {
    if (approveSuccess) {
      stake({
        address: STAKING_CONTRACT,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [parseUnits(amount, 18)],
      });
    }
  }, [approveSuccess]);
}
```

## Token Page UI

The `/token` page displays:

1. **Stats Row**
   - AMULET Balance
   - Available Credits
   - Credits Used

2. **Action Cards**
   - Free Credits: Claim 40 credits every 30 days
   - Stake AMULET: Lock tokens for 2x credits
   - Credit Pricing: View tier costs

3. **Purchase Section**
   - Buy credits with card (Stripe)
   - 4 package options

## Environment Variables

```env
# Token Contract
VITE_AMULET_TOKEN_ADDRESS=0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c

# Staking Contract (when deployed)
VITE_STAKING_CONTRACT_ADDRESS=
```

## Network Configuration

### Sei Testnet (Atlantic-2)

```javascript
const seiTestnet = {
  id: 1328,
  name: 'Sei Testnet',
  network: 'sei-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sei',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: { http: ['https://evm-rpc-testnet.sei-apis.com'] },
  },
  blockExplorers: {
    default: { name: 'SeiTrace', url: 'https://seitrace.com' },
  },
};
```

### RPC Proxy

The frontend uses a proxy to protect the RPC endpoint:
```
https://sei-rpc-proxy.vercel.app/api/rpc
```

## Files

| File | Purpose |
|------|---------|
| `src/shared/constants.ts` | Token contract address, ABI |
| `src/pages/Token/TokenPage.jsx` | Token UI and staking |
| `src/wagmi.ts` | Wagmi/chain configuration |

## Testnet Faucet

Get test SEI for gas:
- https://atlantic-2.app.sei.io/faucet

## Future Development

### Mainnet Migration
- Deploy AMULET token to Sei Mainnet
- Update contract address in environment
- Deploy staking contract

### Staking Contract
- Solidity contract for locking AMULET
- Credit sync endpoint (`/api/credits/sync-stake`)
- On-chain stake tracking

### Governance
- DAO voting rights for AMULET holders
- Protocol parameter adjustments
- Treasury management
