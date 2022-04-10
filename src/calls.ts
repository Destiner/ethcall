import * as multicallAbi from './abi/multicall.json';
import { Call } from './call';
import Contract from './contract';

// eslint-disable-next-line import/prefer-default-export
export function getEthBalance(address: string, multicallAddress: string): Call {
  const multicall = new Contract(multicallAddress, multicallAbi);
  return multicall.getEthBalance(address) as Call;
}
