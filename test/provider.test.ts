import { BaseProvider, JsonRpcProvider, Network } from '@ethersproject/providers';
import { describe, expect, test, vitest } from 'vitest';

import Provider from '../src/provider';

class FakeProvider extends BaseProvider {
  async getNetwork(): Promise<Network> {
    return {
      name: 'FakeNetwork',
      chainId: -1,
    };
  }
}

describe('Provider', () => {
  test('throws if provider is not initiated', () => {
    const errorMessage = 'Provider should be initialized before use.';
    const provider = new Provider();
    expect(provider.all([])).rejects.toThrow(errorMessage);
    expect(provider.tryAll([])).rejects.toThrow(errorMessage);
    expect(provider.tryEach([], [])).rejects.toThrow(errorMessage);
  });

  test('throws if Multicall is not available', async () => {
    const errorMessage = 'Multicall contract is not available on this network.';
    const provider = new Provider();
    await provider.init(new FakeProvider(0));
    expect(() => provider.getEthBalance('')).toThrow(errorMessage);
    expect(provider.all([])).rejects.toThrow();
    expect(provider.tryAll([])).rejects.toThrow();
    expect(provider.tryEach([], [])).rejects.toThrow();
  });

  test('adds multicall address manually', async () => {
    const chainId = 0x72;
    const provider = new Provider();
    const errorMessage = 'Multicall contract is not available on this network.';
    const providerExt = new Provider({
      [chainId]: {
        1: {
          address: '0xC1a617f5d6bEE81c4677263f08D0c5d1757B7a3e',
          block: 0,
        },
        2: {
          address: '0xC1a617f5d6bEE81c4677263f08D0c5d1757B7a3e',
          block: 0,
        },
        3: {
          address: '0xC1a617f5d6bEE81c4677263f08D0c5d1757B7a3e',
          block: 0,
        },
      }
    });

    await provider.init(new FakeProvider(chainId));

    expect(() => provider.getEthBalance('')).toThrow(errorMessage);
    expect(provider.all([])).rejects.toThrow();
    expect(provider.tryAll([])).rejects.toThrow();
    expect(provider.tryEach([], [])).rejects.toThrow();

    const _warn = console.warn;

    console.warn = vitest.fn();

    await providerExt.init(
      new JsonRpcProvider(
        "https://coston2-api.flare.network/ext/C/rpc"
      )
    );

    expect(() => providerExt.getEthBalance('')).not.toThrow();
    expect(providerExt.all([])).not.rejects.toThrow();
    expect(providerExt.tryAll([])).not.rejects.toThrow();
    expect(providerExt.tryEach([], [])).not.rejects.toThrow();

    expect(console.warn).not.toBeCalled();

    console.warn = _warn;
  });
});
