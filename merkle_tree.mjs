import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import fs from 'fs';
// inputs: array of users' addresses and quantity
// each item in the inputs array is a block of data
// Alice, Bob and Carol's data respectively

const whiteList =  await fs.readFile('whiteList.csv', 'utf8', (error, csvData) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  const rows = csvData.split('\n');
  // Process the data or perform further operations
  return rows;
});
console.log(whiteList);

const inputs = [
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  },
];
// create leaves from users' address and quantity
const leaves = whiteList.map((x) =>
  ethers.solidityPackedKeccak256(
    ["address"],
    [x.address]
  )
);

// create a Merkle tree
const tree = new MerkleTree(leaves, keccak256, { sort: true });
console.log(tree.toString());
const proofs = leaves.map(leaf => tree.getHexProof(leaf));
const root = tree.getHexRoot();