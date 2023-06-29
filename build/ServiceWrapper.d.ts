import { Characteristic, Service, WithUUID } from "homebridge"
export default class ServiceWrapper {
  readonly service: Service
  constructor(service: Service)
  bindBooleanCharacteristic(
    characteristic: WithUUID<new () => Characteristic>,
    getValue: () => Promise<boolean>,
    setValue: (isMuted: boolean, callback: () => void) => void
  ): void
  bindNumberCharacteristic(
    characteristic: WithUUID<typeof Characteristic>,
    getValue: () => Promise<number>,
    setValue: (systemVolume: number, callback: () => void) => void
  ): void
}
