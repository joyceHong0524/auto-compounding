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
const increaseAmountAbi = ['function increase_amount(uint256 _value)'];

const lqdrToken = `0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9`;
const lqdrProxyAddress = `0x6e2ad6527901c9664f016466b8DA1357a004db0f`; // FTM-USDC
// const triStaking = `0x802119e4e253d5c19aa06a5d567c5a41596d6803`;
const vyperAddress = `0x3Ae658656d1C526144db371FaEf2Fff7170654eE`;
const poolID = 11; // FTM-USDC
const TWO_YEAR = 1709337600;

//1. check balance
const lqdr = new ethers.Contract(lqdrToken, erc20Abi, provider);
let lqdrBalance = await lqdr.balanceOf(process.env.FTM_ADDRESS);
console.log('$lqdrBalance: ', ethers.utils.formatEther(lqdrBalance.toString()));

//2. Harvest lqdr
const proxy = new ethers.Contract(lqdrProxyAddress, harvestAbi, provider);
const signedpool = proxy.connect(signer);
const harvestTX = await signedpool.harvest(poolID, process.env.FTM_ADDRESS, {
    gasPrice: ethers.utils.parseUnits('600', 'gwei'),
    gasLimit: 1000000
});
let receipt = await harvestTX.wait();
console.log(`harvestTX: ${harvestTX.hash}`);

await new Promise((r) => setTimeout(r, 2000));

const newlqdr = new ethers.Contract(lqdrToken, erc20Abi, provider);
let afterlqdrBalance = await newlqdr.balanceOf(process.env.FTM_ADDRESS);
console.log(
    'after $afterlqdrBalance: ',
    ethers.utils.formatEther(afterlqdrBalance.toString())
);

await new Promise((r) => setTimeout(r, 5000));

//3. Lock Lqdr
const lockFunction = new ethers.Contract(
    vyperAddress,
    increaseAmountAbi,
    provider
);

const signedLockFunction = lockFunction.connect(signer);
const lockTx = await signedLockFunction.increase_amount(afterlqdrBalance, {
    gasPrice: ethers.utils.parseUnits('600', 'gwei'),
    gasLimit: 1000000
});

let receipt2 = await lockTx.wait();
console.log(receipt2);

// console.log(`receipt : ${JSON.stringify(receipt)}`);
// console.table(receipt.logs);
// console.log(`lockTx : ${lockTx.hash}`);
