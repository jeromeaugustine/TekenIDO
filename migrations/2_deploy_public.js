const BraqToken = artifacts.require("BraqToken");
const PublicSale = artifacts.require("BraqPublicSale");

module.exports = async function (deployer) {
  const braqTokenInstance = await BraqToken.deployed();
  const braqTokenAddress = await braqTokenInstance.address;
  deployer.deploy(PublicSale, braqTokenAddress);
};
