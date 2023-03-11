import { describe, test, expect } from 'vitest';

import { Call, Contract } from '../src';

import erc20Abi from './abi/erc20.json';

describe('Contract', () => {
  test('inits a contract', () => {
    const address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const contract = new Contract(address, erc20Abi);
    expect(contract).toBeTruthy();
  });

  test('creates a call', () => {
    const address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const contract = new Contract(address, erc20Abi);
    const ownerCall = contract.name() as Call;
    expect(ownerCall.contract.address).toEqual(address);
    expect(ownerCall.name).toEqual('name');
  });
});
