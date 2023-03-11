import multicallAbi from './abi/multicall.json' assert { type: 'json' };
import { Call } from './call.js';
import Contract from './contract.js';

function getEthBalance(address: string, multicallAddress: string): Call {
  const multicall = new Contract(multicallAddress, multicallAbi);
  return multicall.getEthBalance(address) as Call;
}

export default getEthBalance;
