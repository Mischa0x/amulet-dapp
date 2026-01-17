import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LocalDeployModule = buildModule("LocalDeployModule", (m) => {
  // Deploy TestAmulet first
  const testAmulet = m.contract("TestAmulet", []);

  // Deploy AmuletStaking with the TestAmulet address
  const amuletStaking = m.contract("AmuletStaking", [testAmulet]);

  return { testAmulet, amuletStaking };
});

export default LocalDeployModule;
