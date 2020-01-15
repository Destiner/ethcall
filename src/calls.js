const Abi = require('./abi.js');
const Contract = require('./contract.js');

const multicallAbi = require('./abi/multicall.json');

const multicallAddress = '0x5e227ad1969ea493b43f840cff78d08a6fc17796';

const multicall = new Contract(multicallAddress, multicallAbi);

function getEthBalance(address) {
	return multicall.getEthBalance(address);
}

module.exports = {
	getEthBalance,
};
