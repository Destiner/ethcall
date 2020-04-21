const Abi = require('./abi.js');
const Contract = require('./contract.js');

const multicallAbi = require('./abi/multicall.json');

function getEthBalance(address, multicallAddress) {
	const multicall = new Contract(multicallAddress, multicallAbi);
	return multicall.getEthBalance(address);
}

module.exports = {
	getEthBalance,
};
