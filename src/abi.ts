import { Coder } from 'abi-coder';
import { JsonFragmentType, Result } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[];

class Abi {
  static encode(
    name: string,
    jsonInputs: readonly JsonFragmentType[],
    params: Params,
  ): string {
    const { params: inputs } = backfillParamNames(jsonInputs);
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
    jsonInputs: readonly JsonFragmentType[],
    params: Params,
  ): string {
    const { params: inputs } = backfillParamNames(jsonInputs);
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
    jsonOutputs: readonly JsonFragmentType[],
    data: string,
  ): Result {
    const { params: outputs, generated } = backfillParamNames(jsonOutputs);
    const abi = [
      {
        type: 'function',
        name,
        outputs,
      },
    ];
    const coder = new Coder(abi);

    const functionOutput = coder.decodeFunctionOutput(name, data);
    const result = outputs.map(
      (output) => functionOutput.values[output.name || ''],
    );
    for (const [name, value] of Object.entries(functionOutput.values)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const key = name as any;
      // Skip generated names for clarity
      if (generated.has(name)) {
        continue;
      }
      // Don't overwrite existing keys
      if (result[key]) {
        continue;
      }
      result[key] = value;
    }
    return result as unknown as Result;
  }
}

// ABI doesn't enforce to specify param names
// However, abi-coder requires names to parse the params.
// Therefore, we "patch" the ABI by assigning unique param names.
function backfillParamNames(jsonParams: readonly JsonFragmentType[]): {
  params: JsonFragmentType[];
  generated: Set<string>;
} {
  const names = new Set(...jsonParams.map((param) => param.name));
  const generated = new Set<string>();
  const params = jsonParams.map((param) => {
    const { name: originalName, indexed, type, components } = param;
    const name = originalName ? originalName : generateUniqueName(names);
    names.add(name);
    if (!originalName) {
      generated.add(name);
    }
    return {
      name,
      indexed,
      type,
      components,
    };
  });
  return {
    params,
    generated,
  };
}

function generateUniqueName(names: Set<string>): string {
  let i = 0;
  while (names.has(i.toString())) {
    i++;
  }
  return `param${Math.random().toString().substring(2)}`;
}

export { Params };

export default Abi;
