const { ethers } = require('ethers');

const Abi = require('./abi.js');

const multicallAbi = require('./abi/multicall.json');

async function all(calls, multicallAddress, provider) {
	const multicall = new ethers.Contract(multicallAddress, multicallAbi, provider);
	const callRequests = calls.map(call => {
		const callData = Abi.encode(call.name, call.inputs, call.params);
		return {
			target: call.contract.address,
			callData,
		};
	});
	const response = await multicall.aggregate(callRequests);
	const callCount = calls.length;
	const callResult = [];
	for (let i = 0; i < callCount; i++) {
		const outputs = calls[i].outputs;
		const returnData = response.returnData[i];
		const params = Abi.decode(outputs, returnData);
		const result = outputs.length == 1
			? params[0]
			: params;
		callResult.push(result);
	}
	return callResult;
}

module.exports = {
	all,
};
