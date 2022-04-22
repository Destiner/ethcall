import { BaseProvider, Network } from '@ethersproject/providers';
import { describe, test, expect } from 'vitest';

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
});
