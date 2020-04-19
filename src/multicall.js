const addresses = {
	1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
	4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
	42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
};

async function getAddress(provider) {
	const networkId = await getNetworkId(provider);
	const address = addresses[networkId];
	return address;
}

async function getNetworkId(provider) {
	if (!provider) {
		return 1;
	}
	const network = await provider.getNetwork();
	const networkId = network.chainId;
	return networkId;
}

module.exports = {
	getAddress,
};
