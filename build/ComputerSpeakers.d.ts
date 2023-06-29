import { VolumeAlgorithm } from "./config"
import { Logging } from "homebridge"
declare type Loudness = typeof import("loudness")
export default class ComputerSpeakers {
  private log
  private loudness
  private volume
  constructor(log: Logging, loudness: Loudness)
  getMuted(): Promise<boolean>
  setMuted(newValue: boolean): Promise<void>
  setVolume(volume: number, algorithm: VolumeAlgorithm): Promise<number>
  getVolume(algorithm: VolumeAlgorithm): Promise<number>
  modifyVolume(delta: number, algorithm: VolumeAlgorithm): Promise<number>
}
export {}
