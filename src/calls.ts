import * as multicallAbi from './abi/multicall.json';
import { Call } from './call';
import Contract from './contract';

export function getEthBalance(address: string, multicallAddress: string) {
	const multicall = new Contract(multicallAddress, multicallAbi);
	return multicall.getEthBalance(address) as Call;
}
