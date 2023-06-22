
import { ethers } from "ethers";
import { config as loadEnv } from 'dotenv';
import { promises } from "fs";
const fsPromises = promises;
loadEnv();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = "0x1a9cBc3bAe3716ba3865fE867825fb027751e1b4";
const my_address = "0x6f9e2777D267FAe69b0C5A24a402D14DA1fBcaA1";
const Summer_address = "0x19294812D348aa770b006D466571B6D6c4C62365";
const UPDATED_ABI_FILE_PATH = './build/contracts/BraqToken.json'

const provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/0cbd49cd77ed4132b497031ffc95da6a`);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

async function getContract(contractAddress){
    const data = await fsPromises.readFile(UPDATED_ABI_FILE_PATH, 'utf8');
    const abi = JSON.parse(data)['abi'];
    //console.log(abi);
    return new ethers.Contract(contractAddress, abi, signer);
}

//const my_contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
const token_contract = await getContract(TOKEN_CONTRACT_ADDRESS);
//console.log(my_contract);

export async function addAdmin(adminAddress) {
    const newAdmin = await token_contract.addAdmin(adminAddress);
    return newAdmin;
}

export async function removeAddmin(admin){
    const removed = await token_contract.removeAddmin(admin);
    return removed;
}

export async function totalSupply() {
    const supply = await token_contract.totalSupply();
    return supply;
}

export async function setPoolAddress(_pool, _address){  // _pool is a string that matches one of Pools enum values
    const addrSet = await token_contract.setPoolAddress(_pool, _address)
    return addrSet;
}

export async function getPoolAddress(pool){  // pool is a string that matches one of Pools enum values
    const poolAddress = await token_contract.getPoolAddress(pool)
    return (pool, poolAddress);
}

export async function fundPool(pool, quarter){
    const funded = await token_contract.fundPool(pool, quarter);
    return {pool, quarter, funded};
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
    const started = await token_contract.startPublicSale();
    return owner;
}

export async function publicSale(){
    // Payable method invocation
    const valueToSend = ethers.parseEther('0.01'); // Value to send in Ether
    const methodName = 'publicSale'; // Replace with your payable method name

    const transaction = await token_contract.connect(signer)[methodName]({
        value: valueToSend
    });

    const receipt = await transaction.wait();
    console.log('Transaction hash:', transaction.hash);
    }

export async function withdrawETH(_amount){
    const withdrawal = await token_contract.withdraw(_amount);
    return withdrawal;
}

export async function verify() {
    const withdrawal = await token_contract.verify();
    return withdrawal;
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
/*
const poolSet = await setPoolAddress(Pools.Ecosystem, "0x19294812D348aa770b006D466571B6D6c4C62365");
await poolSet.wait();
console.log("Ecosystem ", await getPoolAddress(Pools.Ecosystem));
console.log( "Owner ", await getOwner());
*/

//console.log(await verify()); 
/*
const {pool, quarter, tx} = await fundPool(Pools.Ecosystem, 16);
await tx.wait();
console.log("Funded ", pool, quarter, "\n tx: ", tx);
*/
//await startPublicSale();
//await publicSale();
const mint_tx = await mintTokens("0x00472A3fB61ff30732adC787373238B47df90643", 3750000);
mint_tx.wait();
console.log(mint_tx);
console.log(await totalSupply() / BigInt(10 ** 18));

//const mint = await mintTokens(my_address, 500);
//await mint.wait();
console.log(await totalSupply() / BigInt(10 ** 18));

//await withdrawETH(BigInt(0.23 * 10 ** 18));


// Functions to add new admin

/*
const newAdmin = await my_contract.addAdmin(Summer_address);
console.log(newAdmin);
*/

//await setURI("ipfs://QmbbTwoKVcXazHfxBQgUNtMGqQc5JbTNCSKGBs3GFyWA1D")

// Mint
//const mint = await mintToken(my_address);
//console.log(mint);
