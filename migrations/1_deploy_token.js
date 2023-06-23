const BraqToken = artifacts.require("BraqToken");
const PublicSale = artifacts.require("BraqPublicSale");

module.exports = async function (deployer) {
  deployer.deploy(BraqToken).then(function() {
    return deployer.deploy(PublicSale, BraqToken.address);
  });
}
