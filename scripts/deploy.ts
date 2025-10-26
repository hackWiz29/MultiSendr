async function main() {
  console.log("🚀 Deploying StableCoinSwapContract...");

  // Get the contract factory
  const { ethers } = require("hardhat");
  const StableCoinSwapContract = await ethers.getContractFactory("StableCoinSwapContract");

  // Deploy the contract
  const swapContract = await StableCoinSwapContract.deploy();

  // Wait for deployment to complete
  await swapContract.waitForDeployment();

  const contractAddress = await swapContract.getAddress();

  console.log("✅ StableCoinSwapContract deployed to:", contractAddress);
  console.log("📋 Contract details:");
  console.log("   - Address:", contractAddress);
  console.log("   - Owner:", await swapContract.owner());
  console.log("   - USDC Balance:", await swapContract.getTokenBalance("0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C"));
  console.log("   - USDT Balance:", await swapContract.getTokenBalance("0xB1b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C"));
  console.log("   - DAI Balance:", await swapContract.getTokenBalance("0xC2b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C"));
  console.log("   - BUSD Balance:", await swapContract.getTokenBalance("0xD3b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C"));

  // Save contract address to a file for frontend integration
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    network: "hardhat",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('./contract-address.json', JSON.stringify(contractInfo, null, 2));
  console.log("💾 Contract address saved to contract-address.json");

  console.log("\n🎯 Next steps:");
  console.log("1. Update your frontend to use contract address:", contractAddress);
  console.log("2. Test the contract with your frontend");
  console.log("3. Deploy to testnet for hackathon demo");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });