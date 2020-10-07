import { Call } from './call';

export default class Contract {
	address: string;
	abi: any[];
	functions: any[];
	[ key: string ]: Call | any;

	constructor(address: string, abi: any[]) {
		this.address = address;
		this.abi = abi;

		this.functions = abi.filter(x => x.type === 'function');
		const callFunctions = this.functions
			.filter(x => x.stateMutability === 'pure' || x.stateMutability === 'view');

		for (const callFunction of callFunctions) {
			const name = callFunction.name;
			const getCall = makeCallFunction(this, name);
			if (!this[name]) {
				defineReadOnly(this, name, getCall);
			}
		}
	}
}

function makeCallFunction(contract: Contract, name: string) {
	return function(...params: any[]): Call {
		const address = contract.address;
		const inputs = contract.functions.find((f: any) => f.name === name).inputs;
		const outputs = contract.functions.find((f: any) => f.name === name).outputs;
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

function defineReadOnly(object: any, name: string, value: any) {
	Object.defineProperty(object, name, {
		enumerable: true,
		value: value,
		writable: false,
	});
}
