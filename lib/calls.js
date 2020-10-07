"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthBalance = void 0;
var multicallAbi = require("./abi/multicall.json");
var contract_1 = require("./contract");
function getEthBalance(address, multicallAddress) {
    var multicall = new contract_1.default(multicallAddress, multicallAbi);
    return multicall.getEthBalance(address);
}
exports.getEthBalance = getEthBalance;
