
import { ethers } from "ethers";
import { config as loadEnv } from 'dotenv';
import { promises } from "fs";
const fsPromises = promises;
loadEnv();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const BASIC_CONTRACT_ADDRESS = "0x34bf23FFB6Fe39fc3Bf4a21f08690a8652653b50";
const UPDATED_CONTRACT_ADDRESS = "0xAa087a1e4D2089558EB7d82CE6FF7A9a21f84fFe";
const my_address = "0x6f9e2777D267FAe69b0C5A24a402D14DA1fBcaA1";
const Summer_address = "0x19294812D348aa770b006D466571B6D6c4C62365";
const BASIC_ABI_FILE_PATH = './ABI/ERC20.json';
const UPDATED_ABI_FILE_PATH = './build/contracts/BraqToken.json'

const provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/cc8cc7e34bb440b19e75b2910913a25e`);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

async function getContract(){
    const data = await fsPromises.readFile(UPDATED_ABI_FILE_PATH, 'utf8');
    const abi = JSON.parse(data)['abi'];
    //console.log(abi);
    return new ethers.Contract(UPDATED_CONTRACT_ADDRESS, abi, signer);
}

//const my_contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
const my_contract = await getContract();
//console.log(my_contract);

export async function addAdmin(adminAddress) {
    const newAdmin = await my_contract.addAdmin(adminAddress);
    return newAdmin;
}

export async function removeAddmin(admin){
    const removed = await my_contract.removeAddmin(admin);
    return removed;
}
export async function totalSupply() {
    const supply = await my_contract.totalSupply();
    return supply;
}

export async function setPoolAddress(_pool, _address){  // _pool is a string that matches one of Pools enum values
    const addrSet = await my_contract.setPoolAddress(_pool, _address)
    return addrSet;
}

export async function getPoolAddress(pool){  // pool is a string that matches one of Pools enum values
    const poolAddress = await my_contract.getPoolAddress(pool)
    return (pool, poolAddress);
}

export async function fundPool(pool, quarter){
    const funded = await my_contract.fundPool(pool, )
}
async function mintTokens(_to, _amount){
    const mint = await my_contract.mint(_to, amount);
    return mint;
}

export async function getOwner(){
    const owner = await my_contract.owner();
    return owner;
}

// Methods for checking Contracts functionality

/*
const mint = await mintTokens(my_address);
const receipt = await provider.waitForTransaction(mint.hash);
*/

const Pools = {
    Rewards: 0,
    Incentives: 1,
    Listings: 2,
    Team: 3,
    Marketing: 4,
    Private: 5,
    Ecosystem: 6
  };
  
console.log(await totalSupply() / BigInt(10 ** 18));
await setPoolAddress(Pools.Ecosystem, "0x19294812D348aa770b006D466571B6D6c4C62365");
console.log("Ecosystem ", await getPoolAddress(Pools.Ecosystem));
console.log( "Owner ", await getOwner());

// Functions to add new admin

/*
const newAdmin = await my_contract.addAdmin(Summer_address);
console.log(newAdmin);
*/

//await setURI("ipfs://QmbbTwoKVcXazHfxBQgUNtMGqQc5JbTNCSKGBs3GFyWA1D")

// Mint
//const mint = await mintToken(my_address);
//console.log(mint);
