import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AmuletStakingModule = buildModule("AmuletStakingModule", (m) => {
  // The AMULET token address on Ethereum Mainnet
  // This should be set to your deployed AMULET ERC20 token address
  const amuletTokenAddress = m.getParameter(
    "amuletTokenAddress",
    "0x0000000000000000000000000000000000000000" // Placeholder - replace with actual AMULET token address
  );

  const amuletStaking = m.contract("AmuletStaking", [amuletTokenAddress]);

  return { amuletStaking };
});

export default AmuletStakingModule;
