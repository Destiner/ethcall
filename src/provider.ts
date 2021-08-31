import { BaseProvider } from '@ethersproject/providers';

import { Call, all as callAll, tryAll as callTryAll } from './call';
import { getEthBalance } from './calls';

const DEFAULT_CHAIN_ID = 1;

export default class Provider {
	provider?: BaseProvider;
	multicallAddress?: string;
	multicall2Address?: string;

	constructor() {
		this.multicallAddress = getMulticall(DEFAULT_CHAIN_ID);
		this.multicall2Address = getMulticall2(DEFAULT_CHAIN_ID);
	}

	async init(provider: BaseProvider) {
		this.provider = provider;
		const network = await provider.getNetwork();
		this.multicallAddress = getMulticall(network.chainId);
		this.multicall2Address = getMulticall2(network.chainId);
	}

	/**
	 * Makes one call to the multicall contract to retrieve eth balance of the given address.
	 * @param address  Address of the account you want to look up
	 * @param multicallAddress	Address of the Multicall instance to use
	 */
	getEthBalance(address: string) {
		if (!this.provider) {
			throw Error('Provider should be initialized before use.');
		}
		if (!this.multicallAddress) {
			throw Error('Multicall contract is not available on this network.');
		}
		return getEthBalance(address, this.multicallAddress);
	}

	/**
	 * Aggregates multiple calls into one call. Reverts when any of the calls fails. For
	 * ignoring the success of each call, use {@link tryAll} instead.
	 * @param calls  Array of Call objects containing information about each read call
	 * @param block  Block number for this call
	 */
	async all(calls: Call[], block?: number) {
		if (!this.provider) {
			throw Error('Provider should be initialized before use.');
		}
		if (!this.multicallAddress) {
			throw Error('Multicall contract is not available on this network.');
		}
		const provider = this.provider as BaseProvider;
		return await callAll(provider, this.multicallAddress, calls, block);
	}

	/**
	 * Aggregates multiple calls into one call. If any of the calls fail, it returns a null value
	 * in place of the failed call's return data.
	 * @param calls  Array of Call objects containing information about each read call
	 * @param block  Block number for this call
	 */
	async tryAll(calls: Call[], block?: number) {
		if (!this.provider) {
			throw Error('Provider should be initialized before use.');
		}
		if (!this.multicall2Address) {
			throw Error('Multicall2 contract is not available on this network.');
		}
		const provider = this.provider as BaseProvider;
		return await callTryAll(provider, this.multicall2Address, calls, block);
	}
}

function getMulticall(chainId: number): string {
	const addressMap: Record<number, string> = {
		1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
		3: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
		4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
		42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
		56: '0xe21a5b299756ee452a6a871ff29852862fc99be9',
		100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
		108: '0xfce4609743e17d349b7e5f478a7a9a6cfa3c808c',
		128: '0x56171094a15b8cac4314c0f8930100b939503bd9',
		137: '0x35e4aa226ce52e1e59e5e5ec24766007bcbe2e7d',
		250: '0xc04d660976c923ddba750341fe5923e47900cf24',
		321: '0x543528e13eac69206e87334cca971503a552438b',
		820: '0x8ba3d23241c7044be703afaf2a728fdbc16f5f6f',
		1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
		1313161554: '0xa48c67d1c60b8187ecb7c549e8a670419d356994',
		1666600000: '0xfe4980f62d708c2a84d3929859ea226340759320',
	};
	return addressMap[chainId];
}

function getMulticall2(chainId: number): string {
	const addressMap: Record<number, string> = {
		1: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
		4: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
		5: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
		42: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
		56: '0x4c6bb7c24b6f3dfdfb548e54b7c5ea4cb52a0069',
		100: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
		137: '0xf43a7be1b284aa908cdfed8b3e286961956b4d2c',
	};
	return addressMap[chainId];
}
