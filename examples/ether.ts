import { getDefaultProvider } from 'ethers';

import { Provider } from '../src/index.js';

async function run(): Promise<void> {
  const provider = getDefaultProvider('mainnet');
  const ethcallProvider = new Provider(1, provider);

  const accounts = [
    '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    '0x22d8432cc7aA4f8712a655fC4cdfB1baEC29FCA9',
  ];

  const calls = accounts.map((account) =>
    ethcallProvider.getEthBalance(account),
  );
  const balances = await ethcallProvider.all(calls);
  console.log(balances);
}

export default run;
