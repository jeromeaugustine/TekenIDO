const BraqToken = artifacts.require("BraqToken");
const PublicSale = artifacts.require("BraqPublicSale");
const MerkleTree = require("merkletreejs").MerkleTree;
const { ethers } = require("ethers");
const keccak256 = require("keccak256");
const fs = require("fs");

module.exports = async function (deployer) {
  const csvData = await new Promise((resolve, reject) => {
    fs.readFile("whiteList1.csv", "utf8", (error, data) => {
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
  //console.log(tree.toString());
  const merkleProofs = leaves.map((leaf) => tree.getHexProof(leaf));
  const root = tree.getHexRoot();

  const braqTokenInstance = await BraqToken.deployed();

  const braqTokenAddress = braqTokenInstance.address;
  console.log("Root", root);
  console.log("Merkle Proofs", typeof(merkleProofs));

  deployer.deploy(PublicSale, braqTokenAddress, root);
};
