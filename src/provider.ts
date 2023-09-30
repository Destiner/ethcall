import type { Provider as EthersProvider } from 'ethers';

import type { Call, CallOverrides } from './call.js';
import {
  all as callAll,
  tryAll as callTryAll,
  tryEach as callTryEach,
} from './call.js';
import getEthBalance from './calls.js';
import type { Multicall } from './multicall.js';
import { getMulticall, getMulticall2, getMulticall3 } from './multicall.js';

type CallType = 'BASIC' | 'TRY_ALL' | 'TRY_EACH';

type BlockTag = number | 'latest' | 'pending';

interface ProviderConfig {
  multicall: Partial<Multicall>;
}

/**
 * Represents a Multicall provider. Used to execute multiple Calls.
 */
class Provider {
  #provider?: EthersProvider;
  #config: Partial<ProviderConfig>;
  #multicall: Multicall | null;
  #multicall2: Multicall | null;
  #multicall3: Multicall | null;

  /**
   * Create a provider.
   * @param provider ethers provider
   * @param chainId Network chain
   * @param config Provider configuration
   */
  constructor(
    chainId: number,
    provider: EthersProvider,
    config?: Partial<ProviderConfig>,
  ) {
    this.#provider = provider;
    this.#config = config || {};
    this.#multicall = this.#getMulticall(chainId, 1);
    this.#multicall2 = this.#getMulticall(chainId, 2);
    this.#multicall3 = this.#getMulticall(chainId, 3);
  }

  /**
   * Make one call to the multicall contract to retrieve eth balance of the given address.
   * @param address Address of the account you want to look up
   * @returns Ether balance fetching call
   */
  getEthBalance(address: string): Call {
    const multicall = this.#multicall3 || this.#multicall2 || this.#multicall;
    if (!multicall) {
      throw Error('Multicall contract is not available on this network.');
    }
    return getEthBalance(address, multicall.address);
  }

  /**
   * Aggregate multiple calls into one call.
   * Reverts when any of the calls fails.
   * For ignoring the success of each call, use {@link tryAll} instead.
   * @param calls Array of Call objects containing information about each read call
   * @param block Block number for this call
   * @returns List of fetched data
   */
  async all<T>(calls: Call[], overrides?: CallOverrides): Promise<T[]> {
    if (!this.#provider) {
      throw Error('Provider should be initialized before use.');
    }
    const multicall = this.#getContract('BASIC', overrides?.blockTag);
    const provider = this.#provider;
    return await callAll<T>(provider, multicall, calls, overrides);
  }

  /**
   * Aggregate multiple calls into one call.
   * If any of the calls fail, it returns a null value in place of the failed call's return data.
   * @param calls Array of Call objects containing information about each read call
   * @param block Block number for this call
   * @returns List of fetched data. Failed calls will result in null values.
   */
  async tryAll<T>(
    calls: Call[],
    overrides?: CallOverrides,
  ): Promise<(T | null)[]> {
    if (!this.#provider) {
      throw Error('Provider should be initialized before use.');
    }
    const multicall = this.#getContract('TRY_ALL', overrides?.blockTag);
    const provider = this.#provider;
    return await callTryAll<T>(provider, multicall, calls, overrides);
  }

  /**
   * Aggregates multiple calls into one call.
   * If any of the calls that are allowed to fail do fail,
   * it returns a null value in place of the failed call's return data.
   * @param calls Array of Call objects containing information about each read call
   * @param canFail Array of booleans specifying whether each call can fail
   * @param block Block number for this call
   * @returns List of fetched data. Failed calls will result in null values.
   */
  async tryEach<T>(
    calls: Call[],
    canFail: boolean[],
    overrides?: CallOverrides,
  ): Promise<(T | null)[]> {
    if (!this.#provider) {
      throw Error('Provider should be initialized before use.');
    }
    const multicall = this.#getContract('TRY_EACH', overrides?.blockTag);
    const provider = this.#provider;
    const failableCalls = calls.map((call, index) => {
      return {
        ...call,
        canFail: canFail[index],
      };
    });
    return await callTryEach<T>(provider, multicall, failableCalls, overrides);
  }

  #getContract(call: CallType, block?: BlockTag): Multicall | null {
    const multicall = this.#isAvailable(this.#multicall, block)
      ? this.#multicall
      : null;
    const multicall2 = this.#isAvailable(this.#multicall2, block)
      ? this.#multicall2
      : null;
    const multicall3 = this.#isAvailable(this.#multicall3, block)
      ? this.#multicall3
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

  #isAvailable(multicall: Multicall | null, block?: BlockTag): boolean {
    if (!multicall) {
      return false;
    }
    if (!block) {
      return true;
    }
    if (block === 'latest' || block === 'pending') {
      return true;
    }
    return multicall.block < block;
  }

  #getMulticall(chainId: number, version: 1 | 2 | 3): Multicall | null {
    function getRegistryMulticall(
      chainId: number,
      version: 1 | 2 | 3,
    ): Multicall | null {
      switch (version) {
        case 1:
          return getMulticall(chainId);
        case 2:
          return getMulticall2(chainId);
        case 3:
          return getMulticall3(chainId);
      }
    }

    const customMulticall = this.#config?.multicall;
    if (!customMulticall) {
      return getRegistryMulticall(chainId, version);
    }
    const address = customMulticall.address;
    if (!address) {
      return getRegistryMulticall(chainId, version);
    }
    return {
      address,
      block: customMulticall.block || 0,
    };
  }
}

export default Provider;

export type { BlockTag };
