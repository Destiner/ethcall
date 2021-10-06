import { BaseProvider } from '@ethersproject/providers';

import { Call, all as callAll, tryAll as callTryAll } from './call';
import { getEthBalance } from './calls';
import { getMulticall, getMulticall2 } from './multicall';

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
