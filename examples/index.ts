import aave from './aave';
import erc20 from './erc20';
import ether from './ether';

async function run(): Promise<void> {
  await aave();
  await erc20();
  await ether();
}

run();
