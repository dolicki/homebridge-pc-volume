import { VolumeAlgorithm } from "./config"
import { Logging } from "homebridge"

type Loudness = typeof import("loudness")

export default class ComputerSpeakers {
  private log: Logging
  private loudness: Loudness
  private volume = 50
  private muted = false

  constructor(log: Logging, loudness: Loudness) {
    this.log = log
    this.loudness = loudness
  }

  public async getMuted(): Promise<boolean> {
    this.log.debug(`Getting muted status`)
    try {
      this.log.debug(`Got muted status: ${this.muted}`)
      return this.muted
    } catch (error) {
      this.log.debug(`Failed to get muted status: ${error}`)
      throw error
    }
  }

  public setMuted(newValue: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.log.debug(`Setting muted status to ${newValue}`)
      this.muted = newValue
      resolve()
    })
  }

  public setVolume(
    volume: number,
    algorithm: VolumeAlgorithm
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const systemVolume = ((): number => {
        switch (algorithm) {
          case VolumeAlgorithm.Linear:
            this.log.debug(`Setting volume to ${volume}%`)
            return volume
          case VolumeAlgorithm.Logarithmic: {
            const logarithmicVolume =
              Math.pow(10, volume / (100 / Math.log10(101))) - 1
            this.log.debug(
              `Converted HomeKit volume ${volume}% to ${logarithmicVolume} due to logarithmic volume algorithm`
            )
            return logarithmicVolume
          }
        }
      })()
      this.volume = volume
      resolve(this.volume)
    })
  }

  public getVolume(algorithm: VolumeAlgorithm): Promise<number> {
    return new Promise((resolve, reject) => {
      this.log.debug(`Getting volume`)
      resolve(this.volume)
    })
  }

  public modifyVolume(
    delta: number,
    algorithm: VolumeAlgorithm
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.log.debug(`Modifying volume by ${delta}%`)

      this.getVolume(algorithm)
        .then((homekitVolume) => {
          this.setVolume(homekitVolume + delta, algorithm)
            .then(() => {
              resolve(homekitVolume + delta)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
