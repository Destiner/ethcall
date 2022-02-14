import { JsonFragmentType } from '@ethersproject/abi';
import Coder from 'abi-coder';

export default class Abi {
  static encode(name: string, jsonInputs: JsonFragmentType[], params: any[]) {
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

  static encodeConstructor(jsonInputs: JsonFragmentType[], params: any[]) {
    const abi = [
      {
        type: 'constructor',
        inputs: jsonInputs,
      },
    ];
    const coder = new Coder(abi);
    return coder.encodeConstructor(params);
  }

  static decode(name: string, jsonOutputs: JsonFragmentType[], data: string) {
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
