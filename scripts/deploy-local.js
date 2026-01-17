// Local deployment script for testing
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy TestAmulet token
  const TestAmulet = await hre.ethers.getContractFactory("TestAmulet");
  const amulet = await TestAmulet.deploy();
  await amulet.waitForDeployment();
  const amuletAddress = await amulet.getAddress();
  console.log("TestAmulet deployed to:", amuletAddress);

  // Deploy AmuletStaking with the token address
  const AmuletStaking = await hre.ethers.getContractFactory("AmuletStaking");
  const staking = await AmuletStaking.deploy(amuletAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("AmuletStaking deployed to:", stakingAddress);

  console.log("\n=== Add these to your .env.local ===");
  console.log(`VITE_AMULET_TOKEN_ADDRESS=${amuletAddress}`);
  console.log(`VITE_STAKING_CONTRACT_ADDRESS=${stakingAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
