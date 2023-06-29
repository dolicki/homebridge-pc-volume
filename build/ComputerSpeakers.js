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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
class ComputerSpeakers {
    constructor(log, loudness) {
        this.volume = 50;
        this.muted = false;
        this.log = log;
        this.loudness = loudness;
    }
    getMuted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.debug(`Getting muted status`);
            try {
                this.log.debug(`Got muted status: ${this.muted}`);
                return false;
            }
            catch (error) {
                this.log.debug(`Failed to get muted status: ${error}`);
                throw error;
            }
        });
    }
    setMuted(newValue) {
        return new Promise((resolve, reject) => {
            this.log.debug(`Setting muted status to ${newValue}`);
            this.muted = newValue;
            resolve();
        });
    }
    setVolume(volume, algorithm) {
        return new Promise((resolve, reject) => {
            const systemVolume = (() => {
                switch (algorithm) {
                    case config_1.VolumeAlgorithm.Linear:
                        this.log.debug(`Setting volume to ${volume}%`);
                        return volume;
                    case config_1.VolumeAlgorithm.Logarithmic: {
                        const logarithmicVolume = Math.pow(10, volume / (100 / Math.log10(101))) - 1;
                        this.log.debug(`Converted HomeKit volume ${volume}% to ${logarithmicVolume} due to logarithmic volume algorithm`);
                        return logarithmicVolume;
                    }
                }
            })();
            this.volume = volume;
            resolve(this.volume);
        });
    }
    getVolume(algorithm) {
        return new Promise((resolve, reject) => {
            this.log.debug(`Getting volume`);
            resolve(this.volume);
        });
    }
    modifyVolume(delta, algorithm) {
        return new Promise((resolve, reject) => {
            this.log.debug(`Modifying volume by ${delta}%`);
            this.getVolume(algorithm)
                .then((homekitVolume) => {
                this.setVolume(homekitVolume + delta, algorithm)
                    .then(() => {
                    resolve(homekitVolume + delta);
                })
                    .catch((error) => {
                    reject(error);
                });
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
}
exports.default = ComputerSpeakers;
//# sourceMappingURL=ComputerSpeakers.js.map