"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loudness_1 = __importDefault(require("loudness"));
const sinon = __importStar(require("sinon"));
const ComputerSpeakers_1 = __importDefault(require("../ComputerSpeakers"));
const MockLogging_1 = __importDefault(require("./mocks/MockLogging"));
describe("ComputerSpeakers", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = new ComputerSpeakers_1.default(new MockLogging_1.default(), loudness_1.default);
    });
    describe("#getMuted", () => {
        describe("when the system returns an error", () => {
            let stub;
            let expectedError;
            beforeEach(() => {
                expectedError = new Error("This is a test error");
                stub = sinon.stub(loudness_1.default, "getMuted").rejects(expectedError);
            });
            afterEach(() => {
                stub.restore();
            });
            it("should return the error when the mute characteristic is requested", () => {
                expect.assertions(1);
                expect(wrapper.getMuted()).rejects.toEqual(expectedError);
            });
        });
        describe("when the system does not return an error", () => {
            let stub;
            let systemMutedStatus;
            beforeEach(() => {
                systemMutedStatus = true;
                stub = sinon.stub(loudness_1.default, "getMuted").resolves(systemMutedStatus);
            });
            afterEach(() => {
                stub.restore();
            });
            it("should return the system status", () => {
                expect.assertions(1);
                expect(wrapper.getMuted()).resolves.toEqual(systemMutedStatus);
            });
        });
    });
});
//# sourceMappingURL=ComputerSpeakers.js.map