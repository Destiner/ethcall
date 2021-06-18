import { BaseProvider } from '@ethersproject/providers';

import { Call, all as callAll } from './call';
import { getEthBalance } from './calls';

export default class Provider {
	provider?: BaseProvider;
	multicallAddress: string;

	constructor() {
		this.multicallAddress = getAddress(1);
	}

	async init(provider: BaseProvider) {
		this.provider = provider;
		const network = await provider.getNetwork();
		this.multicallAddress = getAddress(network.chainId);
	}

	getEthBalance(address: string) {
		if (!this.provider) {
			console.error('Provider should be initialized before use.');
		}
		return getEthBalance(address, this.multicallAddress);
	}

	async all(calls: Call[], block?: number) {
		if (!this.provider) {
			console.error('Provider should be initialized before use.');
		}
		const provider = this.provider as BaseProvider;
		return await callAll(provider, this.multicallAddress, calls, block);
	}
}

function getAddress(chainId: number): string {
	const addressMap: Record<number, string> = {
		1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
		3: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
		4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
		42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
		56: '0xe21a5b299756ee452a6a871ff29852862fc99be9',
		100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
		137: '0x35e4aa226ce52e1e59e5e5ec24766007bcbe2e7d',
		1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
	};
	const address = addressMap[chainId];
	return address;
}
