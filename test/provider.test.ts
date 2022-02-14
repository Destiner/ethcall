import { BaseProvider } from '@ethersproject/providers';
import { describe, test, expect } from 'vitest';

import Provider from '../src/provider';

class FakeProvider extends BaseProvider {
  async getNetwork() {
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
    expect(() => provider.getEthBalance('')).toThrow(errorMessage);
    expect(provider.all([])).rejects.toThrow();
    expect(provider.tryAll([])).rejects.toThrow();
  });

  test('throws if Multicall is not available', async () => {
    const errorMessage = 'Multicall contract is not available on this network.';
    const provider = new Provider();
    await provider.init(new FakeProvider(0));
    expect(() => provider.getEthBalance('')).toThrow(errorMessage);
    expect(provider.all([])).rejects.toThrow();
    expect(provider.tryAll([])).rejects.toThrow();
  });
});
