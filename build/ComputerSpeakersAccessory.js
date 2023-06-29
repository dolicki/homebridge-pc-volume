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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loudness_1 = __importDefault(require("loudness"));
const config_1 = require("./config");
const ServiceWrapper_1 = __importDefault(require("./ServiceWrapper"));
const ComputerSpeakers_1 = __importDefault(require("./ComputerSpeakers"));
class ComputerSpeakersAccessory {
    constructor(logger, config, api) {
        this.v = false;
        this.Service = api.hap.Service;
        this.Characteristic = api.hap.Characteristic;
        this.computerSpeakers = new ComputerSpeakers_1.default(logger, loudness_1.default);
        const name = config.name;
        const services = config.services || [config_1.Service.Lightbulb];
        const logarithmic = config.logarithmic || false;
        const switchVolumeDelta = config.switchVolumeDelta || 5;
        const switchDelay = config.switchDelay || 10;
        const volumeAlgorithm = logarithmic
            ? config_1.VolumeAlgorithm.Logarithmic
            : config_1.VolumeAlgorithm.Linear;
        if (services.indexOf(config_1.Service.Speaker) > -1) {
            logger.debug("Creating speaker service");
            this.speakerService = new ServiceWrapper_1.default(new this.Service.Outlet(name
            //ConfigService.Speaker
            ));
            this.speakerService.service
                .getCharacteristic(this.Characteristic.On)
                .on("get" /* CharacteristicEventTypes.GET */, (callback) => {
                callback(null, this.v);
            });
            this.speakerService.service
                .getCharacteristic(this.Characteristic.On)
                .on("set" /* CharacteristicEventTypes.SET */, (value, callback) => {
                this.v = !!value;
                callback();
            });
            // .on(CharacteristicEventTypes.SET, () => {
            //   return 1
            // })
            // this.speakerService.bindBooleanCharacteristic(
            //   this.Characteristic.On,
            //   async () => {
            //     return true
            //   },
            //   (isMuted: boolean, callback: () => void) => {
            //     // this.computerSpeakers
            //     //   .setMuted(isMuted)
            //     //   .then(this.notifyServicesOfMuteStatus.bind(this, isMuted))
            //     //   .finally(callback)
            //     this.speakerService.service.getCharacteristic(this.Characteristic.On).setValue(123)
            //   }
            // )
            // this.speakerService.bindNumberCharacteristic(
            //   this.Characteristic.Volume,
            //   this.computerSpeakers.getVolume.bind(
            //     this.computerSpeakers,
            //     volumeAlgorithm
            //   ),
            //   (volume: number, callback: () => void) => {
            //     this.computerSpeakers
            //       .setVolume(volume, volumeAlgorithm)
            //       .then(this.notifyServicesOfVolume.bind(this))
            //       .finally(callback)
            //   }
            // )
        }
        if (services.indexOf(config_1.Service.Fan) > -1) {
            logger.debug("Creating fan service");
            this.fanService = new ServiceWrapper_1.default(new this.Service.Fan(name, config_1.Service.Fan));
            //new this.Service.AccessoryRuntimeInformation('name', )
            this.fanService.bindBooleanCharacteristic(this.Characteristic.On, () => __awaiter(this, void 0, void 0, function* () {
                const isOn = yield this.computerSpeakers.getMuted();
                logger.debug(`Flipping fan on value from ${isOn} to ${!isOn} before setting muted status`);
                return !isOn;
            }), (isOn, callback) => {
                // logger.debug(
                //   `Flipping system muted value from ${isMuted} to ${!isMuted} before returning fan on value`
                // )
                this.computerSpeakers
                    .setMuted(!isOn)
                    .then(this.notifyServicesOfMuteStatus.bind(this, isOn))
                    .finally(callback);
                logger.debug(`Goran is ON: ${isOn}`);
            });
            this.fanService.bindNumberCharacteristic(this.Characteristic.RotationSpeed, this.computerSpeakers.getVolume.bind(this.computerSpeakers, volumeAlgorithm), (newValue, callback) => {
                this.computerSpeakers
                    .setVolume(newValue, volumeAlgorithm)
                    .then(this.notifyServicesOfVolume.bind(this))
                    .finally(callback);
            });
        }
        if (services.indexOf(config_1.Service.Lightbulb) > -1) {
            logger.debug("Creating lightbulb service");
            this.lightService = new ServiceWrapper_1.default(new this.Service.Lightbulb(name, config_1.Service.Lightbulb));
            this.lightService.bindBooleanCharacteristic(this.Characteristic.On, () => __awaiter(this, void 0, void 0, function* () {
                const isOn = yield this.computerSpeakers.getMuted();
                logger.debug(`Flipping light on value from ${isOn} to ${!isOn} before setting muted status`);
                return !isOn;
            }), (isMuted, callback) => {
                logger.debug(`Flipping system muted value from ${isMuted} to ${!isMuted} before returning light on value`);
                this.computerSpeakers
                    .setMuted(false)
                    .then(this.notifyServicesOfMuteStatus.bind(this, false))
                    .finally(callback);
                logger.debug(`Goran-ddebugger: ${isMuted}`);
            });
            this.lightService.bindNumberCharacteristic(this.Characteristic.Brightness, this.computerSpeakers.getVolume.bind(this.computerSpeakers, volumeAlgorithm), (newValue, callback) => {
                this.computerSpeakers
                    .setVolume(newValue, volumeAlgorithm)
                    .then(this.notifyServicesOfVolume.bind(this))
                    .finally(callback);
            });
        }
        if (services.indexOf(config_1.Service.IncreaseVolumeButton) > -1) {
            logger.debug("Creating increase volume service");
            this.volumeUpButtonService = new ServiceWrapper_1.default(new this.Service.Switch(name + " +" + switchVolumeDelta + "%", config_1.Service.IncreaseVolumeButton));
            this.volumeUpButtonService.bindBooleanCharacteristic(this.Characteristic.On, () => __awaiter(this, void 0, void 0, function* () {
                return false;
            }), (isOn, callback) => {
                if (isOn) {
                    this.computerSpeakers
                        .modifyVolume(config.switchVolumeDelta, volumeAlgorithm)
                        .then((newVolume) => {
                        this.notifyServicesOfVolume(newVolume);
                    })
                        .finally(() => {
                        callback();
                        setTimeout(() => {
                            logger.debug("Setting volume up button back to off");
                            this.volumeUpButtonService.service.updateCharacteristic(this.Characteristic.On, false);
                        }, switchDelay);
                    });
                }
                else {
                    callback();
                }
            });
        }
        if (services.indexOf(config_1.Service.DecreaseVolumeButton) > -1) {
            logger.debug("Creating decrease volume service");
            this.volumeDownService = new ServiceWrapper_1.default(new this.Service.Switch(name + " -" + switchVolumeDelta + "%", config_1.Service.DecreaseVolumeButton));
            this.volumeDownService.bindBooleanCharacteristic(this.Characteristic.On, () => __awaiter(this, void 0, void 0, function* () {
                return false;
            }), (isOn, callback) => {
                if (isOn) {
                    this.computerSpeakers
                        .modifyVolume(-config.switchVolumeDelta, volumeAlgorithm)
                        .then((newVolume) => {
                        this.notifyServicesOfVolume(newVolume);
                    })
                        .finally(() => {
                        callback();
                        setTimeout(() => {
                            logger.debug("Setting volume up button back to off");
                            this.volumeDownService.service.updateCharacteristic(this.Characteristic.On, false);
                        }, switchDelay);
                    });
                }
                else {
                    callback();
                }
            });
        }
        if (config.initialVolume !== undefined) {
            this.computerSpeakers
                .setVolume(config.initialVolume, volumeAlgorithm)
                .catch((error) => {
                logger.debug(`Failed setting initial volume to ${config.initialVolume}: ${error}`);
            });
        }
        if (config.initiallyMuted !== undefined) {
            this.computerSpeakers.setMuted(config.initiallyMuted).catch((error) => {
                logger.debug(`Failed setting initial muted status to ${config.initiallyMuted}: ${error}`);
            });
        }
    }
    getServices() {
        return [
            this.speakerService,
            this.fanService,
            this.lightService,
            this.volumeUpButtonService,
            this.volumeDownService,
        ]
            .filter((wrapper) => wrapper !== undefined)
            .map((wrapper) => wrapper.service);
    }
    notifyServicesOfVolume(volume) {
        if (this.speakerService) {
            this.speakerService.service
                .getCharacteristic(this.Characteristic.Volume)
                .updateValue(volume);
        }
        if (this.fanService) {
            this.fanService.service
                .getCharacteristic(this.Characteristic.RotationSpeed)
                .updateValue(volume);
        }
        if (this.lightService) {
            this.lightService.service
                .getCharacteristic(this.Characteristic.Brightness)
                .updateValue(volume);
        }
    }
    notifyServicesOfMuteStatus(isMuted) {
        if (this.speakerService) {
            this.speakerService.service
                .getCharacteristic(this.Characteristic.Mute)
                .updateValue(isMuted);
        }
        if (this.fanService) {
            this.fanService.service
                .getCharacteristic(this.Characteristic.On)
                .updateValue(isMuted);
        }
        if (this.lightService) {
            this.lightService.service
                .getCharacteristic(this.Characteristic.On)
                .updateValue(isMuted);
        }
    }
}
exports.default = ComputerSpeakersAccessory;
//# sourceMappingURL=ComputerSpeakersAccessory.js.map