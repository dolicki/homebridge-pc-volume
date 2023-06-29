import loudness from "loudness"
import Config, { Service as ConfigService, VolumeAlgorithm } from "./config"
import {
  API,
  AccessoryPlugin,
  Characteristic as HAPCharacteristic,
  Service as HAPService,
  Logging,
} from "homebridge"
import ServiceWrapper from "./ServiceWrapper"
import ComputerSpeakers from "./ComputerSpeakers"

export default class ComputerSpeakersAccessory implements AccessoryPlugin {
  private Service: typeof HAPService
  private Characteristic: typeof HAPCharacteristic
  private computerSpeakers: ComputerSpeakers
  private speakerService?: ServiceWrapper
  private fanService?: ServiceWrapper
  private lightService?: ServiceWrapper
  private volumeUpButtonService?: ServiceWrapper
  private volumeDownService?: ServiceWrapper

  constructor(logger: Logging, config: Config, api: API) {
    this.Service = api.hap.Service
    this.Characteristic = api.hap.Characteristic
    this.computerSpeakers = new ComputerSpeakers(logger, loudness)
    const name = config.name
    const services = config.services || [ConfigService.Lightbulb]
    const logarithmic = config.logarithmic || false
    const switchVolumeDelta = config.switchVolumeDelta || 5
    const switchDelay = config.switchDelay || 10
    const volumeAlgorithm = logarithmic
      ? VolumeAlgorithm.Logarithmic
      : VolumeAlgorithm.Linear

    if (services.indexOf(ConfigService.Speaker) > -1) {
      logger.debug("Creating speaker service")

      this.speakerService = new ServiceWrapper(
        new this.Service.Speaker(name, ConfigService.Speaker)
      )

      this.speakerService.bindBooleanCharacteristic(
        this.Characteristic.Mute,
        async () => {
          return this.computerSpeakers.getMuted()
        },
        (isMuted: boolean, callback: () => void) => {
          this.computerSpeakers
            .setMuted(isMuted)
            .then(this.notifyServicesOfMuteStatus.bind(this, isMuted))
            .finally(callback)
        }
      )
      this.speakerService.bindNumberCharacteristic(
        this.Characteristic.Volume,
        this.computerSpeakers.getVolume.bind(
          this.computerSpeakers,
          volumeAlgorithm
        ),
        (volume: number, callback: () => void) => {
          this.computerSpeakers
            .setVolume(volume, volumeAlgorithm)
            .then(this.notifyServicesOfVolume.bind(this))
            .finally(callback)
        }
      )
    }

    if (services.indexOf(ConfigService.Fan) > -1) {
      logger.debug("Creating fan service")

      this.fanService = new ServiceWrapper(
        new this.Service.Fan(name, ConfigService.Fan)
      )

      this.fanService.bindBooleanCharacteristic(
        this.Characteristic.On,
        async () => {
          const isOn = await this.computerSpeakers.getMuted()
          logger.debug(
            `Flipping fan on value from ${isOn} to ${!isOn} before setting muted status`
          )
          return !isOn
        },
        (isMuted: boolean, callback: () => void) => {
          logger.debug(
            `Flipping system muted value from ${isMuted} to ${!isMuted} before returning fan on value`
          )
          this.computerSpeakers
            .setMuted(!isMuted)
            .then(this.notifyServicesOfMuteStatus.bind(this, !isMuted))
            .finally(callback)
        }
      )
      this.fanService.bindNumberCharacteristic(
        this.Characteristic.RotationSpeed,
        this.computerSpeakers.getVolume.bind(
          this.computerSpeakers,
          volumeAlgorithm
        ),
        (newValue: number, callback: () => void) => {
          this.computerSpeakers
            .setVolume(newValue, volumeAlgorithm)
            .then(this.notifyServicesOfVolume.bind(this))
            .finally(callback)
        }
      )
    }

    if (services.indexOf(ConfigService.Lightbulb) > -1) {
      logger.debug("Creating lightbulb service")

      this.lightService = new ServiceWrapper(
        new this.Service.Lightbulb(name, ConfigService.Lightbulb)
      )

      this.lightService.bindBooleanCharacteristic(
        this.Characteristic.On,
        async () => {
          const isOn = await this.computerSpeakers.getMuted()
          logger.debug(
            `Flipping light on value from ${isOn} to ${!isOn} before setting muted status`
          )
          return !isOn
        },
        (isMuted: boolean, callback: () => void) => {
          logger.debug(
            `Flipping system muted value from ${isMuted} to ${!isMuted} before returning light on value`
          )
          this.computerSpeakers
            .setMuted(!isMuted)
            .then(this.notifyServicesOfMuteStatus.bind(this, !isMuted))
            .finally(callback)
        }
      )
      this.lightService.bindNumberCharacteristic(
        this.Characteristic.Brightness,
        this.computerSpeakers.getVolume.bind(
          this.computerSpeakers,
          volumeAlgorithm
        ),
        (newValue: number, callback: () => void) => {
          this.computerSpeakers
            .setVolume(newValue, volumeAlgorithm)
            .then(this.notifyServicesOfVolume.bind(this))
            .finally(callback)
        }
      )
    }

    if (services.indexOf(ConfigService.IncreaseVolumeButton) > -1) {
      logger.debug("Creating increase volume service")

      this.volumeUpButtonService = new ServiceWrapper(
        new this.Service.Switch(
          name + " +" + switchVolumeDelta + "%",
          ConfigService.IncreaseVolumeButton
        )
      )

      this.volumeUpButtonService.bindBooleanCharacteristic(
        this.Characteristic.On,
        async () => {
          return false
        },
        (isOn: boolean, callback: () => void) => {
          if (isOn) {
            this.computerSpeakers
              .modifyVolume(config.switchVolumeDelta, volumeAlgorithm)
              .then((newVolume) => {
                this.notifyServicesOfVolume(newVolume)
              })
              .finally(() => {
                callback()

                setTimeout(() => {
                  logger.debug("Setting volume up button back to off")
                  this.volumeUpButtonService.service.updateCharacteristic(
                    this.Characteristic.On,
                    false
                  )
                }, switchDelay)
              })
          } else {
            callback()
          }
        }
      )
    }

    if (services.indexOf(ConfigService.DecreaseVolumeButton) > -1) {
      logger.debug("Creating decrease volume service")

      this.volumeDownService = new ServiceWrapper(
        new this.Service.Switch(
          name + " -" + switchVolumeDelta + "%",
          ConfigService.DecreaseVolumeButton
        )
      )

      this.volumeDownService.bindBooleanCharacteristic(
        this.Characteristic.On,
        async () => {
          return false
        },
        (isOn: boolean, callback: () => void) => {
          if (isOn) {
            this.computerSpeakers
              .modifyVolume(-config.switchVolumeDelta, volumeAlgorithm)
              .then((newVolume) => {
                this.notifyServicesOfVolume(newVolume)
              })
              .finally(() => {
                callback()

                setTimeout(() => {
                  logger.debug("Setting volume up button back to off")
                  this.volumeDownService.service.updateCharacteristic(
                    this.Characteristic.On,
                    false
                  )
                }, switchDelay)
              })
          } else {
            callback()
          }
        }
      )
    }

    if (config.initialVolume !== undefined) {
      this.computerSpeakers
        .setVolume(config.initialVolume, volumeAlgorithm)
        .catch((error) => {
          logger.debug(
            `Failed setting initial volume to ${config.initialVolume}: ${error}`
          )
        })
    }

    if (config.initiallyMuted !== undefined) {
      this.computerSpeakers.setMuted(config.initiallyMuted).catch((error) => {
        logger.debug(
          `Failed setting initial muted status to ${config.initiallyMuted}: ${error}`
        )
      })
    }
  }

  public getServices(): HAPService[] {
    return [
      this.speakerService,
      this.fanService,
      this.lightService,
      this.volumeUpButtonService,
      this.volumeDownService,
    ]
      .filter((wrapper) => wrapper !== undefined)
      .map((wrapper) => wrapper.service)
  }

  private notifyServicesOfVolume(volume: number): void {
    if (this.speakerService) {
      this.speakerService.service
        .getCharacteristic(this.Characteristic.Volume)
        .updateValue(volume)
    }
    if (this.fanService) {
      this.fanService.service
        .getCharacteristic(this.Characteristic.RotationSpeed)
        .updateValue(volume)
    }
    if (this.lightService) {
      this.lightService.service
        .getCharacteristic(this.Characteristic.Brightness)
        .updateValue(volume)
    }
  }

  private notifyServicesOfMuteStatus(isMuted: boolean): void {
    if (this.speakerService) {
      this.speakerService.service
        .getCharacteristic(this.Characteristic.Mute)
        .updateValue(isMuted)
    }
    if (this.fanService) {
      this.fanService.service
        .getCharacteristic(this.Characteristic.On)
        .updateValue(isMuted)
    }
    if (this.lightService) {
      this.lightService.service
        .getCharacteristic(this.Characteristic.On)
        .updateValue(isMuted)
    }
  }
}
