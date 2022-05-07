import { JsonFragment } from '@ethersproject/abi';

import { Params } from './abi';
import { Call } from './call';

/**
 * Represents a deployed contract. Generates a Call per each request.
 * Call generation has a syntax similar to ethers.
 * @example
 * const daiContract = new Contract(daiAddress, erc20Abi);
 * daiContract.balanceOf(address); // returns a Call object
 */
class Contract {
  address: string;
  abi: JsonFragment[];
  functions: JsonFragment[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: Call | any;

  /**
   * Create a contract.
   * @param address Address of the contract
   * @param abi ABI of the contract
   */
  constructor(address: string, abi: JsonFragment[]) {
    this.address = address;
    this.abi = abi;

    this.functions = abi.filter((x) => x.type === 'function');
    const callFunctions = this.functions.filter(
      (x) => x.stateMutability === 'pure' || x.stateMutability === 'view',
    );

    for (const callFunction of callFunctions) {
      const name = callFunction.name;
      if (!name) {
        continue;
      }
      const getCall = makeCallFunction(this, name);
      if (!this[name]) {
        Object.defineProperty(this, name, {
          enumerable: true,
          value: getCall,
          writable: false,
        });
      }
    }
  }
}

function makeCallFunction(contract: Contract, name: string) {
  return (...params: Params): Call => {
    const address = contract.address;
    const func = contract.functions.find((f) => f.name === name);
    const inputs = func?.inputs || [];
    const outputs = func?.outputs || [];
    return {
      contract: {
        address,
      },
      name,
      inputs,
      outputs,
      params,
    };
  };
}

export default Contract;
