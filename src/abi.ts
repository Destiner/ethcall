import { JsonFragmentType, Result } from '@ethersproject/abi';
import Coder from 'abi-coder';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[];

class Abi {
  static encode(
    name: string,
    jsonInputs: JsonFragmentType[],
    params: Params,
  ): string {
    const abi = [
      {
        type: 'function',
        name,
        inputs: jsonInputs,
      },
    ];
    const coder = new Coder(abi);
    return coder.encodeFunction(name, params);
  }

  static encodeConstructor(
    jsonInputs: JsonFragmentType[],
    params: Params,
  ): string {
    const abi = [
      {
        type: 'constructor',
        inputs: jsonInputs,
      },
    ];
    const coder = new Coder(abi);
    return coder.encodeConstructor(params);
  }

  static decode(
    name: string,
    jsonOutputs: JsonFragmentType[],
    data: string,
  ): Result {
    const abi = [
      {
        type: 'function',
        name,
        outputs: jsonOutputs,
      },
    ];
    const coder = new Coder(abi);
    const output = coder.decodeFunctionOutput(name, data);
    return output.values;
  }
}

export { Params };

export default Abi;
