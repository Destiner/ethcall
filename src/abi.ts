import {
	JsonFragmentType,
	ParamType,
	defaultAbiCoder,
} from '@ethersproject/abi';
import * as sha3 from 'js-sha3';

export default class Abi {
	static encode(name: string, jsonInputs: JsonFragmentType[], params: any[]) {
		const inputs = jsonInputs.map((input) => ParamType.fromObject(input));
		const functionSignature = getFunctionSignature(name, inputs);
		const functionHash = sha3.keccak256(functionSignature);
		const functionData = functionHash.substring(0, 8);
		const argumentString = defaultAbiCoder.encode(inputs, params);
		const argumentData = argumentString.substring(2);
		const inputData = `0x${functionData}${argumentData}`;
		return inputData;
	}

	static encodeConstructor(jsonInputs: JsonFragmentType[], params: any[]) {
		const inputs = jsonInputs.map((input) => ParamType.fromObject(input));
		const data = defaultAbiCoder.encode(inputs, params);
		return data;
	}

	static decode(jsonOutputs: JsonFragmentType[], data: string) {
		const outputs = jsonOutputs.map((output) => ParamType.fromObject(output));
		const params = defaultAbiCoder.decode(outputs, data);
		return params;
	}
}

function getFunctionSignature(name: string, inputs: ParamType[]): string {
	const types: string[] = [];
	for (const input of inputs) {
		if (input.type === 'tuple') {
			const tupleString = getFunctionSignature('', input.components);
			types.push(tupleString);
			continue;
		}
		if (input.type === 'tuple[]') {
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
