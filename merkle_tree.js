/*
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import fs from 'fs';
*/
const { MerkleTree } = require("merkletreejs");
const { ethers } = require("ethers");
const keccak256 = require("keccak256");
const fs = require("fs");
// inputs: array of users' addresses and quantity
// each item in the inputs array is a block of data
// Alice, Bob and Carol's data respectively
export async function getRoot(){

const csvData = await new Promise((resolve, reject) => {
  fs.readFile('whiteList.csv','utf8', (error, data) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(data);
  });
});

const rows = csvData.split('\n');
  // Process the data or perform further operations
const whiteList = rows.map((address) => {
    return { address };
  });  
console.log(whiteList);

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
const merkleProof = leaves.map(leaf => tree.getHexProof(leaf));
console.log("HexProofs ", merkleProofs);
const root = tree.getHexRoot();
/*
const merkleProof = await hexProofs.map(proof => proof.map((hexString) => { 
  const normalizedHexString = hexString.replace(/^0x/, "").padStart(64, "0");
  return "0x" + normalizedHexString;
})
console.log("bytes32", merkleProof);
);
*/
console.log("Root", root);
return {root, merkleProof};
}
//getRoot();