// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SwapContract.sol";

/**
 * @title SwapContractDeployer
 * @dev Deployer contract for the stablecoin swap platform
 */
contract SwapContractDeployer {
    
    event ContractDeployed(address indexed contractAddress, address indexed deployer);
    
    /**
     * @dev Deploy the swap contract
     * @return contractAddress Address of the deployed contract
     */
    function deploySwapContract() external returns (address contractAddress) {
        StableCoinSwapContract swapContract = new StableCoinSwapContract();
        contractAddress = address(swapContract);
        
        emit ContractDeployed(contractAddress, msg.sender);
        
        return contractAddress;
    }
    
    /**
     * @dev Deploy and initialize the swap contract with supported tokens
     * @param supportedTokens Array of supported token addresses
     * @param fees Array of fees for each token (in basis points)
     * @return contractAddress Address of the deployed contract
     */
    function deployAndInitializeSwapContract(
        address[] memory supportedTokens,
        uint256[] memory fees
    ) external returns (address contractAddress) {
        require(supportedTokens.length == fees.length, "Arrays length mismatch");
        
        StableCoinSwapContract swapContract = new StableCoinSwapContract();
        contractAddress = address(swapContract);
        
        // Initialize supported tokens
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            swapContract.addSupportedToken(supportedTokens[i], fees[i]);
        }
        
        emit ContractDeployed(contractAddress, msg.sender);
        
        return contractAddress;
    }
}
