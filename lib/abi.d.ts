export default class Abi {
    static encode(name: string, inputs: any[], params: any[]): string;
    static decode(outputs: any[], data: string): import("@ethersproject/abi").Result;
}
