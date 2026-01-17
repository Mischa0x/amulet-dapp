// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestAmulet
 * @notice Simple ERC20 token for local testing
 */
contract TestAmulet is ERC20 {
    constructor() ERC20("Test Amulet", "AMULET") {
        // Mint 1 million tokens to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    // Faucet function for testing
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
