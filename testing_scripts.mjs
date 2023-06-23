
import { ethers } from "ethers";
import { config as loadEnv } from 'dotenv';
import { promises } from "fs";
import fs from 'fs';
import { createInterface } from 'readline';
const fsPromises = promises;
loadEnv();

const PUBLIC_KEY = process.env.WALLET_PUBLIC_ADDRESS;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const NOTOWNER_PRIVATE_KEY = process.env.NOTOWNER_WALLET_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = "0x875153E3e781BF4c8E03cE8cEED704a2796a16b4";
const SALE_CONTRACT_ADDRESS = "0x8e6D1EfE37C77BA0c85a373D687F743ade08758B";
const my_address = "0x6f9e2777D267FAe69b0C5A24a402D14DA1fBcaA1";
const Summer_address = "0x19294812D348aa770b006D466571B6D6c4C62365";
const TOKEN_ABI_FILE_PATH = './build/contracts/BraqToken.json';
const SALE_ABI_FILE_PATH = './build/contracts/BraqPublicSale.json';
const WHITELIST_CSV_PATH = './whiteList1.csv';

//const provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/0cbd49cd77ed4132b497031ffc95da6a`);
const provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/b4ceed0a8862403d802e4bb169d3cb14`);
const signer = new ethers.Wallet(NOTOWNER_PRIVATE_KEY, provider);

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

export async function totalSupply() {
    const supply = await token_contract.totalSupply();
    return supply;
}

async function mintTokens(_to, _amount){
    const mint = await token_contract.mint(_to, _amount);
    return mint;
}

export async function getOwner(){
    const owner = await token_contract.owner();
    return owner;
}

export async function startPublicSale(){
    const started = await sale_contract.startPublicSale();
    return started;
}

export async function publicSale(){
    // Payable method invocation
    const valueToSend = ethers.parseEther('0.03'); // Value to send in Ether
    const methodName = 'publicSale'; // Replace with your payable method name

    const transaction = await sale_contract.connect(signer)[methodName]({
        value: valueToSend
    });

    const receipt = await transaction.wait();
    console.log('Transaction hash:', transaction.hash);
    }

export async function withdrawETH(_amount){
    const withdrawal = await sale_contract.withdraw(_amount);
    return withdrawal;
}

export async function setToken(tokenAddress){
    const set = sale_contract.setTokenContract(tokenAddress);
    return set;
}

export async function getTokenAddress(){
    return await sale_contract.getTokenAddress();
}

export async function addToWhiteList(array){
    const added = await sale_contract.addToWhitelist(array);
    return added;
}

// Methods for checking Contracts functionality
  
console.log(await totalSupply() / BigInt(10 ** 18));


//await startPublicSale();
//await publicSale();
//const tokenAddress = await getTokenAddress();
//console.log(tokenAddress)
//const mint_tx = await mintTokens("0xC520944Bc9D498b7BeFE887300c501C1D9651B75", 3750000);
//mint_tx.wait();
//console.log(mint_tx);
/*
console.log(await totalSupply() / BigInt(10 ** 18));
const array = await readAddressesFromCSV(WHITELIST_CSV_PATH);
console.log(array);
const WL = await addToWhiteList(array);
WL.wait();
console.log(WL);
const tokenSet = await setToken(TOKEN_CONTRACT_ADDRESS);
tokenSet.wait();
const tokenAdr = await getTokenAddress();
console.log(tokenAdr);
const mint_tx = await mintTokens(SALE_CONTRACT_ADDRESS, 3750000);
mint_tx.wait();
console.log(mint_tx);
console.log(await totalSupply() / BigInt(10 ** 18));
const start = await startPublicSale();
*/
//await publicSale();
//await withdrawETH(BigInt(0.23 * 10 ** 18));

const tokenAdr = await getTokenAddress();
console.log(tokenAdr);
