import { ethers } from "hardhat";

async function main() {
  const MarketplaceContractFactory = await ethers.getContractFactory("Marketplace")
  const MarketplaceConract = await MarketplaceContractFactory.deploy()

  await MarketplaceConract.deployed()

  console.log("Contract deployed:", MarketplaceConract.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

