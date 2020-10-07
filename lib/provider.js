"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var call_1 = require("./call");
var calls_1 = require("./calls");
var Provider = /** @class */ (function () {
    function Provider() {
        this.provider = null;
        this.multicallAddress = getAddress(1);
    }
    Provider.prototype.init = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var network;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.provider = provider;
                        return [4 /*yield*/, provider.getNetwork()];
                    case 1:
                        network = _a.sent();
                        this.multicallAddress = getAddress(network.chainId);
                        return [2 /*return*/];
                }
            });
        });
    };
    Provider.prototype.getEthBalance = function (address) {
        if (!this.provider) {
            console.error('Provider should be initialized before use.');
        }
        return calls_1.getEthBalance(address, this.multicallAddress);
    };
    Provider.prototype.all = function (calls) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.provider) {
                            console.error('Provider should be initialized before use.');
                        }
                        return [4 /*yield*/, call_1.all(calls, this.multicallAddress, this.provider)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Provider;
}());
exports.default = Provider;
function getAddress(chainId) {
    var addressMap = {
        1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
        4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
        42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
        100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
        1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    };
    var address = addressMap[chainId];
    return address;
}
