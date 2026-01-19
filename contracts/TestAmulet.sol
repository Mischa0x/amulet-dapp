// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestAmulet
 * @notice Simple ERC20 token for local testing
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  SECURITY WARNING - DO NOT DEPLOY TO MAINNET ⚠️                        ║
 * ║                                                                           ║
 * ║  This contract contains an unrestricted faucet() function that allows     ║
 * ║  ANYONE to mint unlimited tokens. This is intentional for testnet use.    ║
 * ║                                                                           ║
 * ║  For mainnet deployment, use a proper ERC20 token with:                   ║
 * ║    - Fixed supply or controlled minting                                   ║
 * ║    - Access control on mint functions                                     ║
 * ║    - Proper tokenomics implementation                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
contract TestAmulet is ERC20 {
    constructor() ERC20("Test Amulet", "AMULET") {
        // Mint 1 million tokens to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /**
     * @notice Faucet function for testing - UNRESTRICTED MINTING
     * @dev ⚠️ WARNING: No access control - anyone can mint unlimited tokens
     *      This function exists ONLY for testnet purposes.
     */
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
