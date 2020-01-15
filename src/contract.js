class Contract {
	constructor(address, abi) {
		this.address = address;
		this.abi = abi;

		this.functions = abi.filter(x => x.type == 'function');
		const callFunctions = this.functions
			.filter(x => x.stateMutability == 'pure' || x.stateMutability == 'view');

		for (const callFunction of callFunctions) {
			const name = callFunction.name;
			const getCall = makeCallFunction(this, name);
			if (!this[name]) {
				defineReadOnly(this, name, getCall);
			}
		}
	}
}

function makeCallFunction(contract, name) {
	return function(...params) {
		const address = contract.address;
		const inputs = contract.functions.find(f => f.name == name).inputs;
		const outputs = contract.functions.find(f => f.name == name).outputs;
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

function defineReadOnly(object, name, value) {
	Object.defineProperty(object, name, {
		enumerable: true,
		value: value,
		writable: false,
	});
}

module.exports = Contract;
