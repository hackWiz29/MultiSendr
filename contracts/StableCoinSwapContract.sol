// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StableCoinSwapContract
 * @dev A contract for swapping stablecoins with batch transaction support
 * @notice This contract allows users to swap between different stablecoins
 *         and execute multiple swaps in a single transaction to save gas
 */
contract StableCoinSwapContract is ReentrancyGuard, Ownable {
    
    // Struct to represent a single swap
    struct SwapData {
        address fromToken;
        address toToken;
        uint256 fromAmount;
        uint256 minToAmount;
        uint256 rate;
    }
    
    // Struct to represent batch swap data
    struct BatchSwapData {
        SwapData[] swaps;
        address user;
        uint256 deadline;
    }
    
    // Events
    event SwapExecuted(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 fromAmount,
        uint256 toAmount,
        uint256 rate
    );
    
    event BatchSwapExecuted(
        address indexed user,
        uint256 swapCount,
        uint256 totalFromAmount,
        uint256 totalToAmount
    );
    
    event LiquidityAdded(
        address indexed token,
        uint256 amount
    );
    
    // State variables
    mapping(address => uint256) public tokenBalances;
    mapping(address => bool) public supportedTokens;
    uint256 public constant FEE_PERCENTAGE = 30; // 0.3% fee (30 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    // Supported stablecoins (for demo purposes)
    address public constant USDC = 0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C; // Mock address
    address public constant USDT = 0xB1b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C; // Mock address
    address public constant DAI = 0xC2b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C; // Mock address
    address public constant BUSD = 0xD3b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C; // Mock address
    
    constructor() Ownable(msg.sender) {
        // Initialize supported tokens
        supportedTokens[USDC] = true;
        supportedTokens[USDT] = true;
        supportedTokens[DAI] = true;
        supportedTokens[BUSD] = true;
        
        // Add initial liquidity (for demo)
        tokenBalances[USDC] = 1000000 * 10**6; // 1M USDC
        tokenBalances[USDT] = 1000000 * 10**6; // 1M USDT
        tokenBalances[DAI] = 1000000 * 10**18; // 1M DAI
        tokenBalances[BUSD] = 1000000 * 10**18; // 1M BUSD
    }
    
    /**
     * @dev Execute a single stablecoin swap
     * @param swapData The swap data containing token addresses and amounts
     */
    function executeSwap(SwapData memory swapData) external nonReentrant {
        require(supportedTokens[swapData.fromToken], "From token not supported");
        require(supportedTokens[swapData.toToken], "To token not supported");
        require(swapData.fromAmount > 0, "From amount must be greater than 0");
        require(swapData.rate > 0, "Invalid exchange rate");
        require(block.timestamp <= swapData.deadline, "Transaction expired");
        
        // Calculate the amount to receive
        uint256 toAmount = (swapData.fromAmount * swapData.rate) / BASIS_POINTS;
        require(toAmount >= swapData.minToAmount, "Insufficient output amount");
        
        // Check if contract has enough liquidity
        require(tokenBalances[swapData.toToken] >= toAmount, "Insufficient liquidity");
        
        // Transfer tokens from user to contract
        IERC20(swapData.fromToken).transferFrom(msg.sender, address(this), swapData.fromAmount);
        
        // Update token balances
        tokenBalances[swapData.fromToken] += swapData.fromAmount;
        tokenBalances[swapData.toToken] -= toAmount;
        
        // Transfer tokens to user
        IERC20(swapData.toToken).transfer(msg.sender, toAmount);
        
        emit SwapExecuted(
            msg.sender,
            swapData.fromToken,
            swapData.toToken,
            swapData.fromAmount,
            toAmount,
            swapData.rate
        );
    }
    
    /**
     * @dev Execute multiple swaps in a single transaction
     * @param batchData The batch swap data containing multiple swaps
     */
    function executeBatchSwap(BatchSwapData memory batchData) external nonReentrant {
        require(batchData.swaps.length > 0, "No swaps provided");
        require(batchData.swaps.length <= 10, "Too many swaps in batch");
        require(block.timestamp <= batchData.deadline, "Transaction expired");
        
        uint256 totalFromAmount = 0;
        uint256 totalToAmount = 0;
        
        // Execute each swap in the batch
        for (uint256 i = 0; i < batchData.swaps.length; i++) {
            SwapData memory swap = batchData.swaps[i];
            
            require(supportedTokens[swap.fromToken], "From token not supported");
            require(supportedTokens[swap.toToken], "To token not supported");
            require(swap.fromAmount > 0, "From amount must be greater than 0");
            require(swap.rate > 0, "Invalid exchange rate");
            
            // Calculate the amount to receive
            uint256 toAmount = (swap.fromAmount * swap.rate) / BASIS_POINTS;
            require(toAmount >= swap.minToAmount, "Insufficient output amount");
            
            // Check if contract has enough liquidity
            require(tokenBalances[swap.toToken] >= toAmount, "Insufficient liquidity");
            
            // Transfer tokens from user to contract
            IERC20(swap.fromToken).transferFrom(msg.sender, address(this), swap.fromAmount);
            
            // Update token balances
            tokenBalances[swap.fromToken] += swap.fromAmount;
            tokenBalances[swap.toToken] -= toAmount;
            
            // Transfer tokens to user
            IERC20(swap.toToken).transfer(msg.sender, toAmount);
            
            totalFromAmount += swap.fromAmount;
            totalToAmount += toAmount;
            
            emit SwapExecuted(
                msg.sender,
                swap.fromToken,
                swap.toToken,
                swap.fromAmount,
                toAmount,
                swap.rate
            );
        }
        
        emit BatchSwapExecuted(
            msg.sender,
            batchData.swaps.length,
            totalFromAmount,
            totalToAmount
        );
    }
    
    /**
     * @dev Add liquidity to the contract (only owner)
     * @param token The token address to add liquidity for
     * @param amount The amount of tokens to add
     */
    function addLiquidity(address token, uint256 amount) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[token] += amount;
        
        emit LiquidityAdded(token, amount);
    }
    
    /**
     * @dev Add a new supported token (only owner)
     * @param token The token address to add
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }
    
    /**
     * @dev Remove a supported token (only owner)
     * @param token The token address to remove
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }
    
    /**
     * @dev Get the balance of a specific token in the contract
     * @param token The token address
     * @return The balance of the token
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return tokenBalances[token];
    }
    
    /**
     * @dev Check if a token is supported
     * @param token The token address
     * @return True if the token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }
    
    /**
     * @dev Get the exchange rate between two tokens (simplified for demo)
     * @param fromToken The source token address
     * @param toToken The destination token address
     * @return The exchange rate in basis points
     */
    function getExchangeRate(address fromToken, address toToken) external pure returns (uint256) {
        // Simplified rate calculation for demo purposes
        // In a real implementation, this would use an oracle or AMM
        if (fromToken == toToken) {
            return BASIS_POINTS; // 1:1 rate for same token
        }
        
        // Mock rates for demo (these would come from an oracle in production)
        if (fromToken == USDC && toToken == USDT) return 10000; // 1:1
        if (fromToken == USDT && toToken == USDC) return 10000; // 1:1
        if (fromToken == USDC && toToken == DAI) return 10000; // 1:1
        if (fromToken == DAI && toToken == USDC) return 10000; // 1:1
        if (fromToken == USDC && toToken == BUSD) return 10000; // 1:1
        if (fromToken == BUSD && toToken == USDC) return 10000; // 1:1
        
        return BASIS_POINTS; // Default 1:1 rate
    }
}
