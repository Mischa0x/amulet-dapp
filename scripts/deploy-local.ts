// Local deployment script for testing - Hardhat 3
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardhat's default account #0
const DEPLOYER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function main() {
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  console.log("Deploying contracts with:", account.address);

  // Read artifacts
  const testAmuletArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/TestAmulet.sol/TestAmulet.json"), "utf8")
  );
  const stakingArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/AmuletStaking.sol/AmuletStaking.json"), "utf8")
  );

  // Deploy TestAmulet
  console.log("Deploying TestAmulet...");
  const amuletHash = await walletClient.deployContract({
    abi: testAmuletArtifact.abi,
    bytecode: testAmuletArtifact.bytecode as `0x${string}`,
  });

  const amuletReceipt = await publicClient.waitForTransactionReceipt({ hash: amuletHash });
  const amuletAddress = amuletReceipt.contractAddress!;
  console.log("TestAmulet deployed to:", amuletAddress);

  // Deploy AmuletStaking
  console.log("Deploying AmuletStaking...");
  const stakingHash = await walletClient.deployContract({
    abi: stakingArtifact.abi,
    bytecode: stakingArtifact.bytecode as `0x${string}`,
    args: [amuletAddress],
  });

  const stakingReceipt = await publicClient.waitForTransactionReceipt({ hash: stakingHash });
  const stakingAddress = stakingReceipt.contractAddress!;
  console.log("AmuletStaking deployed to:", stakingAddress);

  console.log("\n=== Add these to your .env.local ===");
  console.log(`VITE_AMULET_TOKEN_ADDRESS=${amuletAddress}`);
  console.log(`VITE_STAKING_CONTRACT_ADDRESS=${stakingAddress}`);
}

main().catch(console.error);
