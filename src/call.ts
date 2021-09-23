import { JsonFragmentType } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';

import Abi from './abi';
import * as multicallAbi from './abi/multicall.json';
import * as multicall2Abi from './abi/multicall2.json';

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
	multicallAddress: string,
	calls: Call[],
	block?: number,
) {
	const multicall = new Contract(multicallAddress, multicallAbi, provider);
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
	const response = await multicall.aggregate(callRequests, overrides);
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
	multicall2Address: string,
	calls: Call[],
	block?: number,
) {
	const multicall2 = new Contract(multicall2Address, multicall2Abi, provider);
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
	const response: CallResult[] = await multicall2.tryAggregate(
		false,
		callRequests,
		overrides,
	);
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
