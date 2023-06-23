const Vesting = artifacts.require("BraqVesting");
const listingsAddress = "0x23FcC07b3286b37440988D95714952Bd3108Aa61";
const marketingAddress = "0xce693C85a4C2c8362eb85Af9dAdc91E6A4040378";

module.exports = async function (deployer) {
  deployer.deploy(Vesting, listingsAddress, marketingAddress);
}