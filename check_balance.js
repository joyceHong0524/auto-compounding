import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
    'https://rpcapi.fantom.network'
);
const signer = new ethers.Wallet(process.env.FTM_PRIVATE_KEY, provider);

const erc20Abi = ['function balanceOf(address) view returns (uint)'];
const harvestAbi = ['function harvest(uint256 pid, address to)'];
const createLockAbi = [
    'function create_lock(uint256 _value, uint256 _unlock_time)'
];

const lqdrToken = `0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9`;
const lqdrProxyAddress = `0x6e2ad6527901c9664f016466b8DA1357a004db0f`; // FTM-USDC
// const triStaking = `0x802119e4e253d5c19aa06a5d567c5a41596d6803`;
const poolID = 11; // FTM-USDC
const TWO_YEAR = 1709337600;

//1. check balance

const lqdr = new ethers.Contract(lqdrToken, erc20Abi, provider);
let lqdrBalance = await lqdr.balanceOf(process.env.FTM_ADDRESS);
console.log('$lqdrBalance: ', ethers.utils.formatEther(lqdrBalance.toString()));

const gasPrice = await provider.getGasPrice();
console.log(ethers.utils.formatUnits(gasPrice, 'gwei'));
