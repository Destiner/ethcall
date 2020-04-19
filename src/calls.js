const Abi = require('./abi.js');
const Contract = require('./contract.js');
const Multicall = require('./multicall.js');

const multicallAbi = require('./abi/multicall.json');

async function getEthBalance(address, provider) {
	const multicallAddress = await Multicall.getAddress(provider);
	const multicall = new Contract(multicallAddress, multicallAbi);
	return multicall.getEthBalance(address);
}

module.exports = {
	getEthBalance,
};
