"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Contract = /** @class */ (function () {
    function Contract(address, abi) {
        this.address = address;
        this.abi = abi;
        this.functions = abi.filter(function (x) { return x.type === 'function'; });
        var callFunctions = this.functions
            .filter(function (x) { return x.stateMutability === 'pure' || x.stateMutability === 'view'; });
        for (var _i = 0, callFunctions_1 = callFunctions; _i < callFunctions_1.length; _i++) {
            var callFunction = callFunctions_1[_i];
            var name_1 = callFunction.name;
            var getCall = makeCallFunction(this, name_1);
            if (!this[name_1]) {
                defineReadOnly(this, name_1, getCall);
            }
        }
    }
    return Contract;
}());
exports.default = Contract;
function makeCallFunction(contract, name) {
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var address = contract.address;
        var inputs = contract.functions.find(function (f) { return f.name === name; }).inputs;
        var outputs = contract.functions.find(function (f) { return f.name === name; }).outputs;
        return {
            contract: {
                address: address,
            },
            name: name,
            inputs: inputs,
            outputs: outputs,
            params: params,
        };
    };
}
function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}
