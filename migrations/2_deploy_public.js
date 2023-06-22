const BraqToken = artifacts.require("BraqToken");
const PublicSale = artifacts.require("BraqPublicSale");

module.exports = async function (deployer) {
  deployer.deploy(PublicSale);
};
