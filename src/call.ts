import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';

import * as multicallAbi from './abi/multicall.json';

import Abi from './abi';

export interface Call {
	contract: {
		address: string;
	};
	name: string
	inputs: any[]
	outputs: any[];
	params: any[];
}

export async function all(provider: BaseProvider, multicallAddress: string, calls: Call[], block?: number) {
	const multicall = new Contract(multicallAddress, multicallAbi, provider);
	const callRequests = calls.map(call => {
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
	const callResult = [];
	for (let i = 0; i < callCount; i++) {
		const outputs = calls[i].outputs;
		const returnData = response.returnData[i];
		const params = Abi.decode(outputs, returnData);
		const result = outputs.length === 1
			? params[0]
			: params;
		callResult.push(result);
	}
	return callResult;
}
