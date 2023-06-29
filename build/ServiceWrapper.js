"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceWrapper {
    constructor(service) {
        this.service = service;
    }
    bindBooleanCharacteristic(characteristic, getValue, setValue) {
        this.service
            .getCharacteristic(characteristic)
            .on("get" /* CharacteristicEventTypes.GET */, (callback) => {
            getValue()
                .then((isMuted) => {
                callback(null, isMuted);
            })
                .catch((error) => {
                callback(error, null);
            });
        })
            .on("set" /* CharacteristicEventTypes.SET */, setValue);
    }
    bindNumberCharacteristic(characteristic, getValue, setValue) {
        this.service
            .addCharacteristic(characteristic)
            .on("get" /* CharacteristicEventTypes.GET */, (callback) => {
            getValue()
                .then((homekitVolume) => {
                callback(null, homekitVolume);
            })
                .catch((error) => {
                callback(error, null);
            });
        })
            .on("set" /* CharacteristicEventTypes.SET */, setValue);
    }
}
exports.default = ServiceWrapper;
//# sourceMappingURL=ServiceWrapper.js.map