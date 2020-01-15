const Abi = require('./abi.js');

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
		const target = contract.address;
		const inputs = contract.functions.find(f => f.name == name).inputs;
		const callData = Abi.encode(name, inputs, params);
		return {
			target,
			callData,
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
