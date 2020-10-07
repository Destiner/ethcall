export default class Contract {
    address: string;
    abi: any[];
    functions: any[];
    [key: string]: any;
    constructor(address: string, abi: any[]);
}
