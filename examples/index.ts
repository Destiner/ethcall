import aave from './aave';
import erc20 from './erc20';
import ether from './ether';
import uniswap from './uniswap';

async function run(): Promise<void> {
  await aave();
  await erc20();
  await ether();
  await uniswap();
}

run();
