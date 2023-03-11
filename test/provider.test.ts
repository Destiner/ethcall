import { BaseProvider, Network } from '@ethersproject/providers';
import { describe, test, expect } from 'vitest';

import Provider from '../src/provider';

class FakeProvider extends AbstractProvider {
  override async getNetwork(): Promise<Network> {
    return new Network('FakeNetwork', -1);
  }
}

describe('Provider', () => {
  test('throws if Multicall is not available', async () => {
    const errorMessage = 'Multicall contract is not available on this network.';
    const fakeProvider = new FakeProvider(0);
    const provider = new Provider(fakeProvider, 0);
    expect(() => provider.getEthBalance('')).toThrow(errorMessage);
    expect(provider.all([])).rejects.toThrow();
    expect(provider.tryAll([])).rejects.toThrow();
    expect(provider.tryEach([], [])).rejects.toThrow();
  });
});
