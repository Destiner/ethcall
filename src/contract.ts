import { JsonFragment } from '@ethersproject/abi';

import { Call } from './call';

export default class Contract {
  address: string;
  abi: JsonFragment[];
  functions: JsonFragment[];
  [key: string]: Call | any;

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
  return (...params: any[]): Call => {
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
