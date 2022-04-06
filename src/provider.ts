import { BaseProvider } from '@ethersproject/providers';

import {
  Call,
  all as callAll,
  tryAll as callTryAll,
  tryEach as callTryEach,
} from './call';
import { getEthBalance } from './calls';
import {
  Multicall,
  getMulticall,
  getMulticall2,
  getMulticall3,
} from './multicall';

const DEFAULT_CHAIN_ID = 1;

type CallType = 'BASIC' | 'TRY_ALL' | 'TRY_EACH';

export default class Provider {
  provider?: BaseProvider;
  multicall: Multicall | null;
  multicall2: Multicall | null;
  multicall3: Multicall | null;

  constructor() {
    this.multicall = getMulticall(DEFAULT_CHAIN_ID);
    this.multicall2 = getMulticall2(DEFAULT_CHAIN_ID);
    this.multicall3 = getMulticall3(DEFAULT_CHAIN_ID);
  }

  async init(provider: BaseProvider) {
    this.provider = provider;
    const network = await provider.getNetwork();
    this.multicall = getMulticall(network.chainId);
    this.multicall2 = getMulticall2(network.chainId);
    this.multicall3 = getMulticall3(network.chainId);
  }

  /**
   * Makes one call to the multicall contract to retrieve eth balance of the given address.
   * @param address  Address of the account you want to look up
   */
  getEthBalance(address: string) {
    if (!this.provider) {
      throw Error('Provider should be initialized before use.');
    }
    if (!this.multicall) {
      throw Error('Multicall contract is not available on this network.');
    }
    return getEthBalance(address, this.multicall?.address);
  }

  /**
   * Aggregates multiple calls into one call. Reverts when any of the calls fails. For
   * ignoring the success of each call, use {@link tryAll} instead.
   * @param calls  Array of Call objects containing information about each read call
   * @param block  Block number for this call
   */
  async all<T>(calls: Call[], block?: number) {
    if (!this.provider) {
      throw Error('Provider should be initialized before use.');
    }
    const multicall = this.#getContract('BASIC', block);
    if (!multicall) {
      console.warn(
        'Multicall contract is not available on this network, using deployless version.',
      );
    }
    const provider = this.provider as BaseProvider;
    return await callAll<T>(provider, multicall, calls, block);
  }

  /**
   * Aggregates multiple calls into one call. If any of the calls fail, it returns a null value
   * in place of the failed call's return data.
   * @param calls  Array of Call objects containing information about each read call
   * @param block  Block number for this call
   */
  async tryAll<T>(calls: Call[], block?: number) {
    if (!this.provider) {
      throw Error('Provider should be initialized before use.');
    }
    const multicall = this.#getContract('TRY_ALL', block);
    if (!multicall) {
      console.warn(
        'Multicall2 contract is not available on this network, using deployless version.',
      );
    }
    const provider = this.provider as BaseProvider;
    return await callTryAll<T>(provider, multicall, calls, block);
  }

  /**
   * Aggregates multiple calls into one call. If any of the calls that are allowed to fail do fail,
   * it returns a null value in place of the failed call's return data.
   * @param calls    Array of Call objects containing information about each read call
   * @param canFail  Array of booleans specifying whether each call can fail
   * @param block    Block number for this call
   */
  async tryEach<T>(calls: Call[], canFail: boolean[], block?: number) {
    if (!this.provider) {
      throw Error('Provider should be initialized before use.');
    }
    const multicall = this.#getContract('TRY_EACH', block);
    if (!multicall) {
      console.warn(
        'Multicall3 contract is not available on this network, reverting.',
      );
    }
    const provider = this.provider as BaseProvider;
    const failableCalls = calls.map((call, index) => {
      return {
        ...call,
        canFail: canFail[index],
      };
    });
    return await callTryEach<T>(provider, multicall, failableCalls, block);
  }

  #getContract(call: CallType, block?: number): Multicall | null {
    const multicall =
      this.multicall && (!block || this.multicall.block < block)
        ? this.multicall
        : null;
    const multicall2 =
      this.multicall2 && (!block || this.multicall2.block < block)
        ? this.multicall2
        : null;
    const multicall3 =
      this.multicall3 && (!block || this.multicall3.block < block)
        ? this.multicall3
        : null;
    switch (call) {
      case 'BASIC':
        return multicall3 || multicall2 || multicall;
      case 'TRY_ALL':
        return multicall3 || multicall2;
      case 'TRY_EACH':
        return multicall3;
    }
  }
}
