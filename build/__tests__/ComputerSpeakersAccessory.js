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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hap_nodejs_1 = require("hap-nodejs");
const loudness_1 = __importDefault(require("loudness"));
const sinon = __importStar(require("sinon"));
const ComputerSpeakersAccessory_1 = __importDefault(require("../ComputerSpeakersAccessory"));
const ServiceWrapper_1 = __importDefault(require("../ServiceWrapper"));
const config_1 = require("../config");
const MockLogging_1 = __importDefault(require("./mocks/MockLogging"));
const api_1 = require("homebridge/lib/api");
describe("ComputerSpeakersAccessory", () => {
    let accessory;
    function createAccessory(config) {
        accessory = new ComputerSpeakersAccessory_1.default(new MockLogging_1.default(), config, new api_1.HomebridgeAPI());
    }
    describe("with a default config", () => {
        let config;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            config = {
                name: "Test Accessory",
                accessory: "ComputerSpeakers",
            };
            createAccessory(config);
        }));
        it("should register a single service", () => {
            expect(accessory.getServices().length).toBe(1);
        });
        it("should register a lighbulb service", () => {
            expect(accessory.getServices()[0].UUID).toStrictEqual(new hap_nodejs_1.Service.Lightbulb("test", "test").UUID);
        });
        it("should use the name provided in the config", () => {
            expect(accessory.getServices()[0].displayName).toStrictEqual(config.name);
        });
    });
    describe("with a config defining a lightbulb service and using the logarithmic option", () => {
        let config;
        let spy;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                logarithmic: true,
                services: [config_1.Service.Lightbulb],
            };
            spy = sinon.spy(ServiceWrapper_1.default.prototype, "bindNumberCharacteristic");
            createAccessory(config);
        });
        afterEach(() => {
            spy.restore();
        });
        it("should register a single service", () => {
            expect(accessory.getServices().length).toBe(1);
        });
        it("should register a lighbulb service", () => {
            expect(accessory.getServices()[0].UUID).toStrictEqual(new hap_nodejs_1.Service.Lightbulb("test", "test").UUID);
        });
        it("should use the name provided in the config", () => {
            expect(accessory.getServices()[0].displayName).toStrictEqual(config.name);
        });
    });
    describe("with a config defining a lightbulb service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Lightbulb],
            };
            createAccessory(config);
        });
        it("should register a single service", () => {
            expect(accessory.getServices().length).toBe(1);
        });
        it("should register a lighbulb service", () => {
            expect(accessory.getServices()[0].UUID).toStrictEqual(new hap_nodejs_1.Service.Lightbulb("test", "test").UUID);
        });
        it("should use the name provided in the config", () => {
            expect(accessory.getServices()[0].displayName).toStrictEqual(config.name);
        });
    });
    describe("with a config defining a fan service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Fan],
            };
            createAccessory(config);
        });
        it("should register a single service", () => {
            expect(accessory.getServices().length).toBe(1);
        });
        it("should register a fan service", () => {
            expect(accessory.getServices()[0].UUID).toStrictEqual(new hap_nodejs_1.Service.Fan("test", "test").UUID);
        });
        it("should use the name provided in the config", () => {
            expect(accessory.getServices()[0].displayName).toStrictEqual(config.name);
        });
    });
    describe("with a config defining a speaker service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Speaker],
            };
            createAccessory(config);
        });
        it("should register a single service", () => {
            expect(accessory.getServices().length).toBe(1);
        });
        it("should register a speaker service", () => {
            expect(accessory.getServices()[0].UUID).toStrictEqual(new hap_nodejs_1.Service.Speaker("test", "test").UUID);
        });
        it("should use the name provided in the config", () => {
            expect(accessory.getServices()[0].displayName).toStrictEqual(config.name);
        });
    });
    describe("with a config defining a speaker service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Speaker],
            };
            createAccessory(config);
        });
        it("should register a single service", () => {
            expect(accessory.getServices().length).toBe(1);
        });
        it("should register a speaker service", () => {
            expect(accessory.getServices()[0].UUID).toStrictEqual(new hap_nodejs_1.Service.Speaker("test", "test").UUID);
        });
        it("should use the name provided in the config", () => {
            expect(accessory.getServices()[0].displayName).toStrictEqual(config.name);
        });
        describe("when the system is muted", () => {
            let stub;
            beforeEach(() => {
                stub = sinon.stub(loudness_1.default, "getMuted").resolves(true);
            });
            afterEach(() => {
                stub.restore();
            });
            it("should request the muted status for node-loudness", (done) => {
                accessory
                    .getServices()[0]
                    .getCharacteristic(hap_nodejs_1.Characteristic.Mute)
                    .emit("get" /* CharacteristicEventTypes.GET */, () => {
                    expect(stub.calledOnce).toStrictEqual(true);
                    done();
                }, {});
            });
            it("should return `true` when the mute characteristic is requested", (done) => {
                accessory
                    .getServices()[0]
                    .getCharacteristic(hap_nodejs_1.Characteristic.Mute)
                    .emit("get" /* CharacteristicEventTypes.GET */, (error, muted) => {
                    expect(muted).toStrictEqual(true);
                    expect(error).toBeNull();
                    done();
                }, {});
            });
        });
    });
    describe("with a config defining a lightbulb and a fan service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Lightbulb, config_1.Service.Fan],
            };
            createAccessory(config);
        });
        it("should register 2 services", () => {
            expect(accessory.getServices().length).toBe(2);
        });
        it("should register a lightbulb service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Lightbulb("test", "test").UUID,
            }));
        });
        it("should register a fan service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Fan("test", "test").UUID,
            }));
        });
        it("should register all services with the name provided in the config", () => {
            accessory
                .getServices()
                .forEach((service) => expect(service.displayName).toStrictEqual(config.name));
        });
    });
    describe("with a config defining a lightbulb and a speaker service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Lightbulb, config_1.Service.Speaker],
            };
            createAccessory(config);
        });
        it("should register 2 services", () => {
            expect(accessory.getServices().length).toBe(2);
        });
        it("should register a lightbulb service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Lightbulb("test", "test").UUID,
            }));
        });
        it("should register a speaker service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Speaker("test", "test").UUID,
            }));
        });
        it("should register all services with the name provided in the config", () => {
            accessory
                .getServices()
                .forEach((service) => expect(service.displayName).toStrictEqual(config.name));
        });
    });
    describe("with a config defining a fan and a speaker service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [config_1.Service.Fan, config_1.Service.Speaker],
            };
            createAccessory(config);
        });
        it("should register 2 services", () => {
            expect(accessory.getServices().length).toBe(2);
        });
        it("should register a fan service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Fan("test", "test").UUID,
            }));
        });
        it("should register a speaker service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Speaker("test", "test").UUID,
            }));
        });
        it("should register all services with the name provided in the config", () => {
            accessory
                .getServices()
                .forEach((service) => expect(service.displayName).toStrictEqual(config.name));
        });
    });
    describe("with a config defining a lightbulb, a fan, and a speaker service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [
                    config_1.Service.Lightbulb,
                    config_1.Service.Fan,
                    config_1.Service.Speaker,
                ],
            };
            createAccessory(config);
        });
        it("should register 3 services", () => {
            expect(accessory.getServices().length).toBe(3);
        });
        it("should register a lightbulb service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Lightbulb("test", "test").UUID,
            }));
        });
        it("should register a fan service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Fan("test", "test").UUID,
            }));
        });
        it("should register a speaker service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Speaker("test", "test").UUID,
            }));
        });
        it("should register all services with the name provided in the config", () => {
            accessory
                .getServices()
                .forEach((service) => expect(service.displayName).toStrictEqual(config.name));
        });
    });
    describe("with a config defining a lightbulb, a fan, and a speaker service", () => {
        let config;
        beforeEach(() => {
            config = {
                name: "Test Computer Speakers",
                accessory: "ComputerSpeakers",
                services: [
                    config_1.Service.Lightbulb,
                    config_1.Service.Fan,
                    config_1.Service.Speaker,
                ],
            };
            createAccessory(config);
        });
        it("should register 3 services", () => {
            expect(accessory.getServices().length).toBe(3);
        });
        it("should register a lightbulb service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Lightbulb("test", "test").UUID,
            }));
        });
        it("should register a fan service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Fan("test", "test").UUID,
            }));
        });
        it("should register a speaker service", () => {
            expect(accessory.getServices()).toContainEqual(expect.objectContaining({
                UUID: new hap_nodejs_1.Service.Speaker("test", "test").UUID,
            }));
        });
        it("should register all services with the name provided in the config", () => {
            accessory
                .getServices()
                .forEach((service) => expect(service.displayName).toStrictEqual(config.name));
        });
    });
});
//# sourceMappingURL=ComputerSpeakersAccessory.js.map