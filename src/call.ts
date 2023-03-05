import { JsonFragment, JsonFragmentType, Result } from '@ethersproject/abi';
import { Signer } from '@ethersproject/abstract-signer';
import { hexConcat } from '@ethersproject/bytes';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider, TransactionReceipt } from '@ethersproject/providers';

import Abi, { Params } from './abi';
import deploylessMulticallAbi from './abi/deploylessMulticall.json';
import deploylessMulticall2Abi from './abi/deploylessMulticall2.json';
import deploylessMulticall3Abi from './abi/deploylessMulticall3.json';
import multicallAbi from './abi/multicall.json';
import multicall2Abi from './abi/multicall2.json';
import multicall3Abi from './abi/multicall3.json';
import {
  Multicall,
  deploylessMulticall2Bytecode,
  deploylessMulticall3Bytecode,
  deploylessMulticallBytecode,
} from './multicall';
import { BlockTag } from './provider';

interface CallRequest {
  target: string;
  callData: string;
}

interface Call {
  contract: {
    address: string;
  };
  name: string;
  inputs: readonly JsonFragmentType[];
  outputs: readonly JsonFragmentType[];
  params: Params;
}

interface FailableCall extends Call {
  canFail: boolean;
}

interface CallResult {
  success: boolean;
  returnData: string;
}

async function all<T>(
  provider: BaseProvider,
  multicall: Multicall | null,
  calls: Call[],
  block?: BlockTag,
): Promise<T[]> {
  const contract = multicall
    ? new Contract(multicall.address, multicallAbi, provider)
    : null;
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params);
    return {
      target: call.contract.address,
      callData,
    };
  });
  const overrides = {
    blockTag: block,
    from: multicall?.address,
  };
  const response = contract
    ? await contract.callStatic.aggregate(callRequests, overrides)
    : await callDeployless(provider, callRequests, block);
  const callCount = calls.length;
  const callResult: T[] = [];
  for (let i = 0; i < callCount; i++) {
    const name = calls[i].name;
    const outputs = calls[i].outputs;
    const returnData = response.returnData[i];
    const params = Abi.decode(name, outputs, returnData);
    const result = outputs.length === 1 ? params[0] : params;
    callResult.push(result);
  }
  return callResult;
}

async function tryAll<T>(
  provider: BaseProvider,
  multicall2: Multicall | null,
  calls: Call[],
  block?: BlockTag,
): Promise<(T | null)[]> {
  const contract = multicall2
    ? new Contract(multicall2.address, multicall2Abi, provider)
    : null;
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params);
    return {
      target: call.contract.address,
      callData,
    };
  });
  const overrides = {
    blockTag: block,
    from: multicall2?.address,
  };
  const response: CallResult[] = contract
    ? await contract.callStatic.tryAggregate(false, callRequests, overrides)
    : await callDeployless2(provider, callRequests, block);
  const callCount = calls.length;
  const callResult: (T | null)[] = [];
  for (let i = 0; i < callCount; i++) {
    const name = calls[i].name;
    const outputs = calls[i].outputs;
    const result = response[i];
    if (!result.success) {
      callResult.push(null);
    } else {
      try {
        const params = Abi.decode(name, outputs, result.returnData);
        const data = outputs.length === 1 ? params[0] : params;
        callResult.push(data);
      } catch (e) {
        // Failed to decode the data: most likely calling non-existing contract
        callResult.push(null);
      }
    }
  }
  return callResult;
}

async function writeTryAll<T>(
  provider: BaseProvider,
  multicall2: Multicall | null,
  calls: Call[],
  signer: Signer,
  overrides?: Record<string, unknown>,
): Promise<TransactionReceipt> {
  const contract = multicall2
    ? new Contract(multicall2.address, multicall2Abi, provider)
    : null;
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params);
    return {
      target: call.contract.address,
      callData,
    };
  });
  const txn = contract
    ? await contract
        .connect(signer)
        .tryAggregate(false, callRequests, overrides)
    : await callDeployless2(provider, callRequests, undefined, signer);
  const receipt = await txn.wait();
  return receipt;
}

async function tryEach<T>(
  provider: BaseProvider,
  multicall3: Multicall | null,
  calls: FailableCall[],
  block?: BlockTag,
): Promise<(T | null)[]> {
  const contract = multicall3
    ? new Contract(multicall3.address, multicall3Abi, provider)
    : null;
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params);
    return {
      target: call.contract.address,
      allowFailure: call.canFail,
      callData,
    };
  });
  const overrides = {
    blockTag: block,
    from: multicall3?.address,
  };
  const response: CallResult[] = contract
    ? await contract.aggregate3(callRequests, overrides)
    : await callDeployless3(provider, callRequests, block);
  const callCount = calls.length;
  const callResult: (T | null)[] = [];
  for (let i = 0; i < callCount; i++) {
    const name = calls[i].name;
    const outputs = calls[i].outputs;
    const result = response[i];
    if (!result.success) {
      callResult.push(null);
    } else {
      try {
        const params = Abi.decode(name, outputs, result.returnData);
        const data = outputs.length === 1 ? params[0] : params;
        callResult.push(data);
      } catch (e) {
        // Failed to decode the data: most likely calling non-existing contract
        callResult.push(null);
      }
    }
  }
  return callResult;
}

async function callDeployless(
  provider: BaseProvider,
  callRequests: CallRequest[],
  block?: BlockTag,
): Promise<Result> {
  const inputAbi: JsonFragment[] = deploylessMulticallAbi;
  const constructor = inputAbi.find((f) => f.type === 'constructor');
  const inputs = constructor?.inputs || [];
  const args = Abi.encodeConstructor(inputs, [callRequests]);
  const data = hexConcat([deploylessMulticallBytecode, args]);
  const callData = await provider.call(
    {
      data,
    },
    block,
  );
  const outputAbi: JsonFragment[] = multicallAbi;
  const outputFunc = outputAbi.find(
    (f) => f.type === 'function' && f.name === 'aggregate',
  );
  const name = outputFunc?.name || '';
  const outputs = outputFunc?.outputs || [];
  const response = Abi.decode(name, outputs, callData);
  return response;
}

async function callDeployless2(
  provider: BaseProvider,
  callRequests: CallRequest[],
  block?: BlockTag,
  signer?: Signer,
): Promise<Result> {
  const inputAbi: JsonFragment[] = deploylessMulticall2Abi;
  const constructor = inputAbi.find((f) => f.type === 'constructor');
  const inputs = constructor?.inputs || [];
  const args = Abi.encodeConstructor(inputs, [false, callRequests]);
  const data = hexConcat([deploylessMulticall2Bytecode, args]);
  const caller = signer ?? provider;
  const callData = await caller.call(
    {
      data,
    },
    block,
  );
  const outputAbi: JsonFragment[] = multicall2Abi;
  const outputFunc = outputAbi.find(
    (f) => f.type === 'function' && f.name === 'tryAggregate',
  );
  const name = outputFunc?.name || '';
  const outputs = outputFunc?.outputs || [];
  // Note "[0]": low-level calls don't automatically unwrap tuple output
  const response = Abi.decode(name, outputs, callData)[0];
  return response as CallResult[];
}

async function callDeployless3(
  provider: BaseProvider,
  callRequests: CallRequest[],
  block?: BlockTag,
): Promise<Result> {
  const inputAbi: JsonFragment[] = deploylessMulticall3Abi;
  const constructor = inputAbi.find((f) => f.type === 'constructor');
  const inputs = constructor?.inputs || [];
  const args = Abi.encodeConstructor(inputs, [callRequests]);
  const data = hexConcat([deploylessMulticall3Bytecode, args]);
  const callData = await provider.call(
    {
      data,
    },
    block,
  );
  const outputAbi: JsonFragment[] = multicall3Abi;
  const outputFunc = outputAbi.find(
    (f) => f.type === 'function' && f.name === 'aggregate3',
  );
  const name = outputFunc?.name || '';
  const outputs = outputFunc?.outputs || [];
  // Note "[0]": low-level calls don't automatically unwrap tuple output
  const response = Abi.decode(name, outputs, callData)[0];
  return response as CallResult[];
}

export { Call, CallResult, all, tryAll, tryEach, writeTryAll };
