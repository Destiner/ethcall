import { JsonFragment, JsonFragmentType } from '@ethersproject/abi';
import { hexConcat } from '@ethersproject/bytes';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';

import Abi from './abi';
import * as deploylessMulticallAbi from './abi/deploylessMulticall.json';
import * as deploylessMulticall2Abi from './abi/deploylessMulticall2.json';
import * as multicallAbi from './abi/multicall.json';
import * as multicall2Abi from './abi/multicall2.json';
import {
	Multicall,
	deploylessMulticall2Bytecode,
	deploylessMulticallBytecode,
} from './multicall';

interface CallRequest {
	target: string;
	callData: string;
}

export interface Call {
	contract: {
		address: string;
	};
	name: string;
	inputs: JsonFragmentType[];
	outputs: JsonFragmentType[];
	params: any[];
}

export interface CallResult {
	success: boolean;
	returnData: string;
}

export async function all(
	provider: BaseProvider,
	multicall: Multicall,
	calls: Call[],
	block?: number,
) {
	const contract = new Contract(multicall.address, multicallAbi, provider);
	const callRequests = calls.map((call) => {
		const callData = Abi.encode(call.name, call.inputs, call.params);
		return {
			target: call.contract.address,
			callData,
		};
	});
	const overrides = {
		blockTag: block,
	};
	const response =
		block && block < multicall.block
			? await callDeployless(provider, callRequests, block)
			: await contract.aggregate(callRequests, overrides);
	const callCount = calls.length;
	const callResult: any[] = [];
	for (let i = 0; i < callCount; i++) {
		const outputs = calls[i].outputs;
		const returnData = response.returnData[i];
		const params = Abi.decode(outputs, returnData);
		const result = outputs.length === 1 ? params[0] : params;
		callResult.push(result);
	}
	return callResult;
}

export async function tryAll(
	provider: BaseProvider,
	multicall2: Multicall,
	calls: Call[],
	block?: number,
) {
	const contract = new Contract(multicall2.address, multicall2Abi, provider);
	const callRequests = calls.map((call) => {
		const callData = Abi.encode(call.name, call.inputs, call.params);
		return {
			target: call.contract.address,
			callData,
		};
	});
	const overrides = {
		blockTag: block,
	};
	const response: CallResult[] =
		block && block < multicall2.block
			? await callDeployless2(provider, callRequests, block)
			: await contract.tryAggregate(false, callRequests, overrides);
	const callCount = calls.length;
	const callResult: any[] = [];
	for (let i = 0; i < callCount; i++) {
		const outputs = calls[i].outputs;
		const result = response[i];
		if (!result.success) {
			callResult.push(null);
		} else {
			const params = Abi.decode(outputs, result.returnData);
			const data = outputs.length === 1 ? params[0] : params;
			callResult.push(data);
		}
	}
	return callResult;
}

async function callDeployless(
	provider: BaseProvider,
	callRequests: CallRequest[],
	block?: number,
) {
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
	const outputs = outputFunc?.outputs || [];
	const response = Abi.decode(outputs, callData);
	return response;
}

async function callDeployless2(
	provider: BaseProvider,
	callRequests: CallRequest[],
	block?: number,
) {
	const inputAbi: JsonFragment[] = deploylessMulticall2Abi;
	const constructor = inputAbi.find((f) => f.type === 'constructor');
	const inputs = constructor?.inputs || [];
	const args = Abi.encodeConstructor(inputs, [false, callRequests]);
	const data = hexConcat([deploylessMulticall2Bytecode, args]);
	const callData = await provider.call(
		{
			data,
		},
		block,
	);
	const outputAbi: JsonFragment[] = multicall2Abi;
	const outputFunc = outputAbi.find(
		(f) => f.type === 'function' && f.name === 'tryAggregate',
	);
	const outputs = outputFunc?.outputs || [];
	// Note "[0]": low-level calls don't automatically unwrap tuple output
	const response = Abi.decode(outputs, callData)[0];
	return response as CallResult[];
}
