import multicallAbi from './abi/multicall.json';
import { Call } from './call';
import Contract from './contract';

function getEthBalance(address: string, multicallAddress: string): Call {
  const multicall = new Contract(multicallAddress, multicallAbi);
  return multicall.getEthBalance(address) as Call;
}

export default getEthBalance;
