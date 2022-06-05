import { JsonFragmentType, Result } from '@ethersproject/abi';
import { Coder } from 'abi-coder';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[];

class Abi {
  static encode(
    name: string,
    jsonInputs: JsonFragmentType[],
    params: Params,
  ): string {
    const inputs = backfillParamNames(jsonInputs);
    const abi = [
      {
        type: 'function',
        name,
        inputs,
      },
    ];
    const coder = new Coder(abi);
    const valueMap = Object.fromEntries(
      inputs.map((input, index) => [input.name, params[index]]),
    );
    return coder.encodeFunction(name, valueMap);
  }

  static encodeConstructor(
    jsonInputs: JsonFragmentType[],
    params: Params,
  ): string {
    const inputs = backfillParamNames(jsonInputs);
    const abi = [
      {
        type: 'constructor',
        inputs,
      },
    ];
    const coder = new Coder(abi);
    const valueMap = Object.fromEntries(
      inputs.map((input, index) => [input.name, params[index]]),
    );
    return coder.encodeConstructor(valueMap);
  }

  static decode(
    name: string,
    jsonOutputs: JsonFragmentType[],
    data: string,
  ): Result {
    const outputs = backfillParamNames(jsonOutputs);
    const abi = [
      {
        type: 'function',
        name,
        outputs,
      },
    ];
    const coder = new Coder(abi);

    const functionOutput = coder.decodeFunctionOutput(name, data);
    return outputs.map((output) => functionOutput.values[output.name || '']);
  }
}

// ABI doesn't enforce to specify param names
// However, abi-coder requires names to parse the params.
// Therefore, we "patch" the ABI by assigning a unique param names.
function backfillParamNames(
  jsonParams: JsonFragmentType[],
): JsonFragmentType[] {
  const names = new Set(...jsonParams.map((param) => param.name));
  return jsonParams.map((param) => {
    const { name: originalName, indexed, type, components } = param;
    const name = originalName ? originalName : generateUniqueName(names);
    names.add(name);
    return {
      name,
      indexed,
      type,
      components,
    };
  });
}

function generateUniqueName(names: Set<string>): string {
  let i = 0;
  while (names.has(i.toString())) {
    i++;
  }
  return i.toString();
}

export { Params };

export default Abi;
