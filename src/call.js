const { ethers } = require('ethers');

const multicallAbi = require('./abi/multicall.json');

const multicallAddress = '0x5e227ad1969ea493b43f840cff78d08a6fc17796';

class Call {
	static async all(calls, provider) {
		const multicall = new ethers.Contract(multicallAddress, multicallAbi, provider);
		const response = await multicall.aggregate(calls);
		const returnData = response.returnData;
		return returnData;
	}
}

module.exports = Call;
