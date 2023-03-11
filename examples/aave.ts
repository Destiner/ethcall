import { getDefaultProvider } from 'ethers';

import { Contract, Provider } from '../src/index.js';

import poolAbi from './abi/aaveV2Pool.json' assert { type: 'json' };

async function run(): Promise<void> {
  const provider = getDefaultProvider('mainnet');
  const ethcallProvider = new Provider(1, provider);

  const stablecoins = [
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
    '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
    '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    '0x0000000000085d4780B73119b644AE5ecd22b376',
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  ];

  const poolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
  const poolContract = new Contract(poolAddress, poolAbi);
  const calls = stablecoins.map((asset) => {
    return poolContract.getReserveData(asset);
  });
  const data = await ethcallProvider.all(calls);
  console.log(data);
}

export default run;
