"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ComputerSpeakersAccessory_1 = __importDefault(require("./ComputerSpeakersAccessory"));
const initialise = (api) => {
    api.registerAccessory("homebridge-pc-volume", "ComputerSpeakers", ComputerSpeakersAccessory_1.default);
};
exports.default = initialise;
//# sourceMappingURL=index.js.map