const { ethers } = require('ethers');
const sha3 = require('js-sha3');

class Abi {
	static encode(name, inputs, params) {
		const functionSignature = getFunctionSignature(name, inputs);
		const functionHash = sha3.keccak256(functionSignature);
		const functionData = functionHash.substring(0, 8);
		const abiCoder = new ethers.utils.AbiCoder();
		const argumentString = abiCoder.encode(inputs, params);
		const argumentData = argumentString.substring(2);
		const inputData = `0x${functionData}${argumentData}`;
		return inputData;
	}
}

function getFunctionSignature(name, inputs) {
	const types = [];
	for (const input of inputs) {
		if (input.type == 'tuple') {
			const tupleString = getFunctionSignature('', input.components);
			types.push(tupleString);
			continue;
		}
		if (input.type == 'tuple[]') {
			const tupleString = getFunctionSignature('', input.components);
			const arrayString = `${tupleString}[]`;
			types.push(arrayString);
			continue;
		}
		types.push(input.type);
	}
	const typeString = types.join(',');
	const functionSignature = `${name}(${typeString})`;
	return functionSignature;
}

module.exports = Abi;
