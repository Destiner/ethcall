import { BaseProvider } from '@ethersproject/providers';
import { expect } from 'earljs';

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
	it('throws if provider is not initiated', () => {
		const errorMessage = 'Provider should be initialized before use.';
		const provider = new Provider();
		expect(() => provider.getEthBalance('')).toThrow(errorMessage);
		expect(provider.all([])).toBeRejected();
		expect(provider.tryAll([])).toBeRejected();
	});

	it('throws if Multicall is not available', async () => {
		const errorMessage = 'Multicall contract is not available on this network.';
		const provider = new Provider();
		await provider.init(new FakeProvider(0));
		expect(() => provider.getEthBalance('')).toThrow(errorMessage);
		expect(provider.all([])).toBeRejected();
		expect(provider.tryAll([])).toBeRejected();
	});
});
