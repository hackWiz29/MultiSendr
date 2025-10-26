// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title StableCoinSwapContract
 * @dev A contract for swapping stablecoins with batch transaction support
 * @author Your Name
 */
contract StableCoinSwapContract is ReentrancyGuard, Ownable, Pausable {
    
    // Events
    event SwapExecuted(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 fromAmount,
        uint256 toAmount,
        uint256 timestamp
    );
    
    event BatchSwapExecuted(
        address indexed user,
        uint256 swapCount,
        uint256 totalValue,
        bytes32 batchId,
        uint256 timestamp
    );
    
    event LiquidityAdded(
        address indexed token,
        uint256 amount,
        address indexed provider
    );
    
    event LiquidityRemoved(
        address indexed token,
        uint256 amount,
        address indexed provider
    );
    
    // Structs
    struct SwapData {
        address fromToken;
        address toToken;
        uint256 fromAmount;
        uint256 minToAmount;
        uint256 deadline;
    }
    
    struct BatchSwapData {
        SwapData[] swaps;
        uint256 deadline;
    }
    
    // State variables
    mapping(address => uint256) public tokenBalances;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public swapFees; // Fee in basis points (100 = 1%)
    
    uint256 public constant MAX_FEE = 1000; // 10% max fee
    uint256 public constant BASIS_POINTS = 10000;
    
    // Supported stablecoins
    address[] public supportedTokenList;
    
    constructor() Ownable(msg.sender) {
        // Set default swap fee to 0.3% (30 basis points)
        swapFees[address(0)] = 30;
    }
    
    /**
     * @dev Add a supported token
     * @param token Address of the token to support
     * @param fee Fee for this token in basis points
     */
    function addSupportedToken(address token, uint256 fee) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(fee <= MAX_FEE, "Fee too high");
        
        supportedTokens[token] = true;
        swapFees[token] = fee;
        supportedTokenList.push(token);
        
        emit LiquidityAdded(token, 0, msg.sender);
    }
    
    /**
     * @dev Remove a supported token
     * @param token Address of the token to remove
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        
        supportedTokens[token] = false;
        swapFees[token] = 0;
        
        // Remove from supported token list
        for (uint256 i = 0; i < supportedTokenList.length; i++) {
            if (supportedTokenList[i] == token) {
                supportedTokenList[i] = supportedTokenList[supportedTokenList.length - 1];
                supportedTokenList.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Execute a single swap
     * @param swapData Swap parameters
     */
    function executeSwap(SwapData memory swapData) 
        external 
        nonReentrant 
        whenNotPaused 
        returns (uint256 toAmount) 
    {
        require(block.timestamp <= swapData.deadline, "Swap expired");
        require(supportedTokens[swapData.fromToken], "From token not supported");
        require(supportedTokens[swapData.toToken], "To token not supported");
        require(swapData.fromToken != swapData.toToken, "Cannot swap same token");
        require(swapData.fromAmount > 0, "Invalid amount");
        
        // Transfer tokens from user
        IERC20(swapData.fromToken).transferFrom(
            msg.sender, 
            address(this), 
            swapData.fromAmount
        );
        
        // Calculate swap amount (simplified 1:1 for stablecoins)
        toAmount = swapData.fromAmount;
        
        // Apply swap fee
        uint256 fee = (toAmount * swapFees[swapData.fromToken]) / BASIS_POINTS;
        toAmount -= fee;
        
        // Ensure minimum amount
        require(toAmount >= swapData.minToAmount, "Insufficient output amount");
        
        // Transfer tokens to user
        IERC20(swapData.toToken).transfer(msg.sender, toAmount);
        
        // Update balances
        tokenBalances[swapData.fromToken] += swapData.fromAmount;
        tokenBalances[swapData.toToken] -= toAmount;
        
        emit SwapExecuted(
            msg.sender,
            swapData.fromToken,
            swapData.toToken,
            swapData.fromAmount,
            toAmount,
            block.timestamp
        );
        
        return toAmount;
    }
    
    /**
     * @dev Execute batch swaps
     * @param batchData Batch swap parameters
     */
    function executeBatchSwap(BatchSwapData memory batchData) 
        external 
        nonReentrant 
        whenNotPaused 
        returns (uint256 totalToAmount) 
    {
        require(block.timestamp <= batchData.deadline, "Batch swap expired");
        require(batchData.swaps.length > 0, "No swaps provided");
        require(batchData.swaps.length <= 10, "Too many swaps"); // Gas limit protection
        
        bytes32 batchId = keccak256(abi.encodePacked(msg.sender, block.timestamp, batchData.swaps.length));
        uint256 totalValue = 0;
        
        for (uint256 i = 0; i < batchData.swaps.length; i++) {
            SwapData memory swap = batchData.swaps[i];
            
            // Transfer tokens from user
            IERC20(swap.fromToken).transferFrom(
                msg.sender, 
                address(this), 
                swap.fromAmount
            );
            
            // Calculate swap amount (simplified 1:1 for stablecoins)
            uint256 toAmount = swap.fromAmount;
            
            // Apply swap fee
            uint256 fee = (toAmount * swapFees[swap.fromToken]) / BASIS_POINTS;
            toAmount -= fee;
            
            // Ensure minimum amount
            require(toAmount >= swap.minToAmount, "Insufficient output amount");
            
            // Transfer tokens to user
            IERC20(swap.toToken).transfer(msg.sender, toAmount);
            
            // Update balances
            tokenBalances[swap.fromToken] += swap.fromAmount;
            tokenBalances[swap.toToken] -= toAmount;
            
            totalValue += swap.fromAmount;
            totalToAmount += toAmount;
            
            emit SwapExecuted(
                msg.sender,
                swap.fromToken,
                swap.toToken,
                swap.fromAmount,
                toAmount,
                block.timestamp
            );
        }
        
        emit BatchSwapExecuted(
            msg.sender,
            batchData.swaps.length,
            totalValue,
            batchId,
            block.timestamp
        );
        
        return totalToAmount;
    }
    
    /**
     * @dev Add liquidity to the contract
     * @param token Token to add liquidity for
     * @param amount Amount to add
     */
    function addLiquidity(address token, uint256 amount) external {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[token] += amount;
        
        emit LiquidityAdded(token, amount, msg.sender);
    }
    
    /**
     * @dev Remove liquidity from the contract
     * @param token Token to remove liquidity for
     * @param amount Amount to remove
     */
    function removeLiquidity(address token, uint256 amount) external onlyOwner {
        require(tokenBalances[token] >= amount, "Insufficient balance");
        
        tokenBalances[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        
        emit LiquidityRemoved(token, amount, msg.sender);
    }
    
    /**
     * @dev Get contract balance for a token
     * @param token Token address
     * @return balance Contract balance
     */
    function getTokenBalance(address token) external view returns (uint256 balance) {
        return tokenBalances[token];
    }
    
    /**
     * @dev Get all supported tokens
     * @return tokens Array of supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory tokens) {
        return supportedTokenList;
    }
    
    /**
     * @dev Calculate swap output amount
     * @param fromToken Input token
     * @param toToken Output token
     * @param fromAmount Input amount
     * @return toAmount Output amount
     */
    function calculateSwapOutput(
        address fromToken,
        address toToken,
        uint256 fromAmount
    ) external view returns (uint256 toAmount) {
        require(supportedTokens[fromToken], "From token not supported");
        require(supportedTokens[toToken], "To token not supported");
        
        // Simplified 1:1 calculation for stablecoins
        toAmount = fromAmount;
        
        // Apply swap fee
        uint256 fee = (toAmount * swapFees[fromToken]) / BASIS_POINTS;
        toAmount -= fee;
        
        return toAmount;
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Emergency unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw function
     * @param token Token to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
}
