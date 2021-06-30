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
		4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
		42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
		56: '0xe21a5b299756ee452a6a871ff29852862fc99be9',
		100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
		108: '0xFCE4609743e17D349B7e5f478A7a9A6cfa3c808C',
		128: '0x56171094a15B8caC4314C0F8930100B939503bd9',
		137: '0x35e4aa226ce52e1e59e5e5ec24766007bcbe2e7d',
		321: '0x543528E13eAc69206e87334ccA971503A552438b',
		820: '0x8bA3D23241c7044bE703afAF2A728FdBc16f5F6f',
		1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
		1313161554: '0xa48C67D1c60b8187Ecb7C549E8A670419d356994',
		1666600000: '0xFE4980f62D708c2A84D3929859Ea226340759320',
	};
	const address = addressMap[chainId];
	return address;
}
