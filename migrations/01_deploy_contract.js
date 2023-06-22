const Braq = artifacts.require("./BraqToken.sol");

module.exports = function(deployer) {
  deployer.deploy(listingsPoolAddress, marketingPoolAddress);
};
