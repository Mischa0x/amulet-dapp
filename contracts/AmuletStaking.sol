// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AmuletStaking
 * @notice Stake AMULET tokens to earn compute credits at 2x multiplier
 * @dev Credits are tracked off-chain via Vercel KV, this contract handles staking logic
 */
contract AmuletStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable amuletToken;

    uint256 public constant STAKE_DURATION = 365 days; // 12 months
    uint256 public constant CREDIT_MULTIPLIER = 2; // 2x credits per AMULET staked
    uint256 public constant CREDITS_PER_TOKEN = 10; // Base: 10 credits per AMULET

    struct StakeInfo {
        uint256 amount;
        uint256 stakedAt;
        uint256 creditsGranted;
        bool active;
    }

    mapping(address => StakeInfo) public stakes;

    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount, uint256 creditsGranted, uint256 expiresAt);
    event Unstaked(address indexed user, uint256 amount, uint256 creditsForfeited);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    error AlreadyStaking();
    error NotStaking();
    error StakePeriodNotEnded();
    error ZeroAmount();
    error TransferFailed();

    constructor(address _amuletToken) Ownable(msg.sender) {
        amuletToken = IERC20(_amuletToken);
    }

    /**
     * @notice Stake AMULET tokens to receive compute credits
     * @param amount The amount of AMULET to stake
     * @dev Credits = amount * CREDITS_PER_TOKEN * CREDIT_MULTIPLIER (2x)
     */
    function stake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (stakes[msg.sender].active) revert AlreadyStaking();

        uint256 creditsGranted = amount * CREDITS_PER_TOKEN * CREDIT_MULTIPLIER;

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            stakedAt: block.timestamp,
            creditsGranted: creditsGranted,
            active: true
        });

        totalStaked += amount;

        amuletToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount, creditsGranted, block.timestamp + STAKE_DURATION);
    }

    /**
     * @notice Unstake tokens after the 12-month period
     * @dev Only callable after STAKE_DURATION has passed
     */
    function unstake() external nonReentrant {
        StakeInfo storage info = stakes[msg.sender];
        if (!info.active) revert NotStaking();
        if (block.timestamp < info.stakedAt + STAKE_DURATION) revert StakePeriodNotEnded();

        uint256 amount = info.amount;

        info.active = false;
        info.amount = 0;
        totalStaked -= amount;

        amuletToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount, 0);
    }

    /**
     * @notice Emergency unstake before period ends (forfeits remaining credits)
     * @dev User loses any unused credits when unstaking early
     */
    function emergencyUnstake() external nonReentrant {
        StakeInfo storage info = stakes[msg.sender];
        if (!info.active) revert NotStaking();

        uint256 amount = info.amount;
        uint256 creditsForfeited = info.creditsGranted;

        info.active = false;
        info.amount = 0;
        info.creditsGranted = 0;
        totalStaked -= amount;

        amuletToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount, creditsForfeited);
    }

    /**
     * @notice Get stake information for an address
     * @param user The address to query
     * @return amount Staked amount
     * @return stakedAt Timestamp when staked
     * @return creditsGranted Total credits granted
     * @return expiresAt Timestamp when stake can be withdrawn
     * @return active Whether stake is currently active
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 stakedAt,
        uint256 creditsGranted,
        uint256 expiresAt,
        bool active
    ) {
        StakeInfo memory info = stakes[user];
        return (
            info.amount,
            info.stakedAt,
            info.creditsGranted,
            info.stakedAt + STAKE_DURATION,
            info.active
        );
    }

    /**
     * @notice Check if an address has an active stake
     * @param user The address to check
     * @return Whether the address has an active stake
     */
    function isStaking(address user) external view returns (bool) {
        return stakes[user].active;
    }

    /**
     * @notice Calculate credits for a given stake amount
     * @param amount The amount of AMULET tokens
     * @return The number of credits that would be granted
     */
    function calculateCredits(uint256 amount) external pure returns (uint256) {
        return amount * CREDITS_PER_TOKEN * CREDIT_MULTIPLIER;
    }

    /**
     * @notice Get time remaining until stake can be withdrawn
     * @param user The address to check
     * @return Seconds remaining, or 0 if stake period ended
     */
    function timeUntilUnstake(address user) external view returns (uint256) {
        StakeInfo memory info = stakes[user];
        if (!info.active) return 0;

        uint256 unlockTime = info.stakedAt + STAKE_DURATION;
        if (block.timestamp >= unlockTime) return 0;

        return unlockTime - block.timestamp;
    }
}
