export default class Provider {
    provider: any;
    multicallAddress: string;
    constructor();
    init(provider: any): Promise<void>;
    getEthBalance(address: string): any;
    all(calls: any[]): Promise<any[]>;
}
