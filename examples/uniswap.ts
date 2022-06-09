import { getDefaultProvider } from '@ethersproject/providers';

import { Contract, Provider } from '../src';

import pairAbi from './abi/uniswapV2Pair.json';

async function run(): Promise<void> {
  const provider = getDefaultProvider('mainnet');
  const ethcallProvider = new Provider();
  await ethcallProvider.init(provider);

  const pairs = [
    '0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5',
    '0x3041CbD36888bECc7bbCBc0045E3B1f144466f5f',
    '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
  ];

  const calls = pairs.map((pair) => {
    const pairContract = new Contract(pair, pairAbi);
    return pairContract.getReserves();
  });
  const data = await ethcallProvider.all(calls);
  console.log(data);
}

export default run;
