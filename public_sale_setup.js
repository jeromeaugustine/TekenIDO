import { ethers } from "ethers";
import { config as loadEnv } from 'dotenv';
import { promises } from "fs";
import fs from 'fs';
import { createInterface } from 'readline';
const fsPromises = promises;
loadEnv();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = "0x54d5481C61e2394545EA55CE58706CB1bF260AA7";
const SALE_CONTRACT_ADDRESS = "0x990166E78Fa1B54145437f5c1720Bc7C3DC8764C";
const my_address = "0x6f9e2777D267FAe69b0C5A24a402D14DA1fBcaA1";
const Summer_address = "0x19294812D348aa770b006D466571B6D6c4C62365";
const TOKEN_ABI_FILE_PATH = './build/contracts/BraqToken.json';
const SALE_ABI_FILE_PATH = './build/contracts/BraqPublicSale.json';
const WHITELIST_CSV_PATH = './whiteList1.csv';

//const provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/0cbd49cd77ed4132b497031ffc95da6a`);
const provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/b4ceed0a8862403d802e4bb169d3cb14`);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

async function getContract(contractAddress, ABIfilePath){
    const data = await fsPromises.readFile(ABIfilePath, 'utf8');
    const abi = JSON.parse(data)['abi'];
    //console.log(abi);
    return new ethers.Contract(contractAddress, abi, signer);
}
const token_contract = await getContract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI_FILE_PATH);
const sale_contract = await getContract(SALE_CONTRACT_ADDRESS, SALE_ABI_FILE_PATH);
//console.log(sale_contract);

async function readAddressesFromCSV(filePath) {
    const addresses = [];
    const fileStream = fs.createReadStream(filePath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    for await (const line of rl) {
      const address = line.trim();
      addresses.push(address);
    }
  
    return addresses;
}

// Setup functions 
export async function setToken(tokenAddress){
    const set = sale_contract.setTokenContract(tokenAddress);
    return set;
}

export async function mintTokens(_to, _amount){
    const mint = await token_contract.mint(_to, _amount);
    return mint;
}

export async function addToWhiteList(array){
    const added = await sale_contract.addToWhitelist(array);
    return added;
}

export async function startPublicSale(){
    const started = await sale_contract.startPublicSale();
    return started;
}