import { VolumeAlgorithm } from "./config"
import { Logging } from "homebridge"

export default class ComputerSpeakers {
  private log: Logging

  constructor(log: Logging) {
    this.log = log
  }

  public async getMuted(): Promise<boolean> {
    this.log.debug(`Getting muted status`)
    try {
      this.log.debug(`Got muted status: ${false}`)
      return false
    } catch (error) {
      this.log.debug(`Failed to get muted status: ${error}`)
      throw error
    }
  }

  public setMuted(newValue: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.log.debug(`Setting muted status to ${newValue}`)
      resolve()
    })
  }

  public setVolume(
    volume: number,
    algorithm: VolumeAlgorithm
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      resolve(15)
    })
  }

  public getVolume(algorithm: VolumeAlgorithm): Promise<number> {
    return new Promise((resolve, reject) => {
      this.log.debug(`Getting volume`)
      resolve(Math.ceil(Math.random() * 100))
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
