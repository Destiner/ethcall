import { getDefaultProvider } from '@ethersproject/providers';

import { Contract, Provider } from '../src';

import erc20Abi from './abi/erc20.json';

async function run(): Promise<void> {
  const provider = getDefaultProvider('mainnet');
  const ethcallProvider = new Provider();
  await ethcallProvider.init(provider);

  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const daiContract = new Contract(daiAddress, erc20Abi);

  const accounts = [
    '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
    '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168',
  ];

  const calls = accounts.map((account) =>
    daiContract.balanceOf(account),
  );
  const balances = await ethcallProvider.all(calls);
  console.log(balances);
}

export default run;
