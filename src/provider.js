const call = require('./call.js');
const calls = require('./calls.js');
const Contract = require('./contract.js');

class Provider {
	constructor() {
		this.provider = null;
		this.multicallAddress = null;
	}

	async init(provider) {
		this.provider = provider;
		this.multicallAddress = await getAddress(provider);
	}

	getEthBalance(address) {
		if (!this.provider) {
			console.error('Provider should be initialized before use.');
		}
		return calls.getEthBalance(address, this.multicallAddress);
	}

	async all(calls) {
		if (!this.provider) {
			console.error('Provider should be initialized before use.');
		}
		return await call.all(calls, this.multicallAddress, this.provider);
	}
}

async function getAddress(provider) {
	const addressMap = {
		1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
		4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
		42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
		100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
		1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
	};
	const network = await provider.getNetwork();
	const networkId = network.chainId;
	const address = addressMap[networkId];
	return address;
}

module.exports = Provider;
