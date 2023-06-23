const Vesting = artifacts.require("BraqVesting");
const token_contract_address = "0x875153E3e781BF4c8E03cE8cEED704a2796a16b4";
const listingsAddress = "0x23FcC07b3286b37440988D95714952Bd3108Aa61";
const marketingAddress = "0xce693C85a4C2c8362eb85Af9dAdc91E6A4040378";

module.exports = async function (deployer) {
  deployer.deploy(Vesting, token_contract_address, listingsAddress, marketingAddress);
}