import aave from './aave.js';
import erc20 from './erc20.js';
import ether from './ether.js';
import uniswap from './uniswap.js';

async function run(): Promise<void> {
  await aave();
  await erc20();
  await ether();
  await uniswap();
}

run();
