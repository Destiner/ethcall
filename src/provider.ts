import { BaseProvider } from '@ethersproject/providers';

import { Call, all as callAll, tryAll as callTryAll } from './call';
import { getEthBalance } from './calls';

const DEFAULT_CHAIN_ID = 1;

export default class Provider {
	provider?: BaseProvider;
	multicallAddress: string;
	multicall2Address?: string;

	constructor() {
		this.multicallAddress = getAddress(DEFAULT_CHAIN_ID);
		this.multicall2Address = getMulticall2Address(DEFAULT_CHAIN_ID);
	}

	async init(provider: BaseProvider) {
		this.provider = provider;
		const network = await provider.getNetwork();
		this.multicallAddress = getAddress(network.chainId);
		this.multicall2Address = getMulticall2Address(network.chainId);
	}

	/**
	 * Makes one call to the multicall contract to retrieve eth balance of the given address.
	 * @param address  Address of the account you want to look up
	 * @param multicallAddress	Address of the Multicall instance to use
	 */
	getEthBalance(address: string, multicallAddress?: string) {
		if (!this.provider) {
			throw Error('Provider should be initialized before use.');
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
			throw Error("Multicall2 address should be initialized before using tryAll()");
		}
		const provider = this.provider as BaseProvider;
		return await callTryAll(provider, this.multicall2Address, calls, block);
	}
}

function getAddress(chainId: number): string {
	const addressMap: Record<number, string> = {
		1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
		4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
		42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
		56: '0xe21a5b299756ee452a6a871ff29852862fc99be9',
		100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
		137: '0x35e4aa226ce52e1e59e5e5ec24766007bcbe2e7d',
		1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
	};
	return addressMap[chainId];
}

function getMulticall2Address(chainId: number): string {
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
