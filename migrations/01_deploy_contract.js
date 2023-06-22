const Braq = artifacts.require("./BraqToken.sol");
const merkleTree = require("../merkle_tree.js");

const marketingPoolAddress = "0xce693C85a4C2c8362eb85Af9dAdc91E6A4040378";
const listingsPoolAddress = "0x23FcC07b3286b37440988D95714952Bd3108Aa61";

module.exports = async function(deployer) {
  const merkleResult = await merkleTree.getRoot();

  // Access the returned values
  const MTroot = merkleResult.root;
  const merkleProof =  merkleResult.merkleProof;
  console.log(MTroot);
  console.log(merkleProof);
  deployer.deploy( MTroot, merkleProof, listingsPoolAddress, marketingPoolAddress);
};
