import { describe, test, expect } from 'vitest';

import Abi from '../src/abi';

describe('ABI', () => {
  test('encodes input', () => {
    expect(Abi.encode(ownerFunction.name, ownerFunction.inputs, [])).toEqual(
      '0x8da5cb5b',
    );
    expect(
      Abi.encode(balanceOfFunction.name, balanceOfFunction.inputs, [
        '0x1a9c8182c09f50c8318d769245bea52c32be35bc',
      ]),
    ).toEqual(
      '0x70a082310000000000000000000000001a9c8182c09f50c8318d769245bea52c32be35bc',
    );
    expect(
      Abi.encode(swapFunction.name, swapFunction.inputs, [
        {
          inAmount: '250000000',
          inAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          outAsset: '0x6b175474e89094c44da98b954eedeac495271d0f',
        },
        '1633000000',
      ]),
    ).toEqual(
      '0xa18d33e1000000000000000000000000000000000000000000000000000000000ee6b280000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000000000061559a40',
    );
  });

  test('encodes constructor input', () => {
    expect(Abi.encodeConstructor(ownerFunction.inputs, [])).toEqual('0x');
    expect(
      Abi.encodeConstructor(balanceOfFunction.inputs, [
        '0x1a9c8182c09f50c8318d769245bea52c32be35bc',
      ]),
    ).toEqual(
      '0x0000000000000000000000001a9c8182c09f50c8318d769245bea52c32be35bc',
    );
    expect(
      Abi.encodeConstructor(swapFunction.inputs, [
        {
          inAmount: '250000000',
          inAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          outAsset: '0x6b175474e89094c44da98b954eedeac495271d0f',
        },
        '1633000000',
      ]),
    ).toEqual(
      '0x000000000000000000000000000000000000000000000000000000000ee6b280000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000000000061559a40',
    );
  });

  test('decodes output', () => {
    expect(
      Abi.decode(
        ownerFunction.name,
        ownerFunction.outputs,
        '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      ),
    ).toEqual(['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']);
    expect(
      Abi.decode(
        balanceOfFunction.name,
        balanceOfFunction.outputs,
        '0x000000000000000000000000000000000000000000000000bb59a27953c60000',
      ).map((a) => a.toString()),
    ).toEqual(['13500000000000000000']);
    expect(Abi.decode(swapFunction.name, swapFunction.outputs, '0x')).toEqual(
      [],
    );
  });
});

const ownerFunction = {
  constant: true,
  inputs: [],
  name: 'owner',
  outputs: [
    {
      internalType: 'address',
      name: '',
      type: 'address',
    },
  ],
  payable: false,
  stateMutability: 'view',
  type: 'function',
};

const balanceOfFunction = {
  constant: true,
  inputs: [
    {
      internalType: 'address',
      name: 'account',
      type: 'address',
    },
  ],
  name: 'balanceOf',
  outputs: [
    {
      internalType: 'uint256',
      name: '',
      type: 'uint256',
    },
  ],
  payable: false,
  stateMutability: 'view',
  type: 'function',
};

const swapFunction = {
  inputs: [
    {
      components: [
        {
          internalType: 'uint256',
          name: 'inAmount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'inAsset',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'outAsset',
          type: 'address',
        },
      ],
      internalType: 'struct Quote',
      name: 'quote',
      type: 'tuple',
    },
    {
      internalType: 'uint64',
      name: 'deadline',
      type: 'uint64',
    },
  ],
  name: 'swap',
  outputs: [],
  stateMutability: 'payable',
  type: 'function',
};
