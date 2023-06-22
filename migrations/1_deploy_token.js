const BraqToken = artifacts.require("BraqToken");

module.exports = function (deployer) {
  deployer.deploy(BraqToken);
};