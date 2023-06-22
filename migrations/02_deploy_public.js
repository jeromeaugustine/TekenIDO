const Braq = artifacts.require("BraqToken.sol");
const MerkleTree = require("merkletreejs").MerkleTree;
const { ethers } = require("ethers");
const keccak256 = require("keccak256");
const fs = require("fs");

module.exports = async function (deployer) {
  const marketingPoolAddress = "0xce693C85a4C2c8362eb85Af9dAdc91E6A4040378";
  const listingsPoolAddress = "0x23FcC07b3286b37440988D95714952Bd3108Aa61";

  const csvData = await new Promise((resolve, reject) => {
    fs.readFile("whiteList.csv", "utf8", (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(data);
    });
  });

  const rows = csvData.split("\n");
  const whiteList = rows.map((address) => {
    return { address };
  });
  console.log(whiteList);

  const leaves = whiteList.map((x) =>
    ethers.solidityPackedKeccak256(["address"], [x.address])
  );

  const tree = new MerkleTree(leaves, keccak256, { sortLeaves: true });
  console.log(tree.toString());
  const merkleProofs = leaves.map((leaf) => tree.getHexProof(leaf));
  const root = tree.getHexRoot();

  console.log("Root", root);
  console.log("Merkle Proofs", typeof(merkleProofs));

  deployer.deploy(Braq, root, merkleProofs, listingsPoolAddress, marketingPoolAddress);
};
