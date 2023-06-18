var BraqToken = artifacts.require("./BraqToken.sol");

module.exports = function(deployer) {
  deployer.deploy(BraqToken);
};
