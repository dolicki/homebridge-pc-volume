import Config from "./config"
import {
  API,
  AccessoryPlugin,
  Service as HAPService,
  Logging,
} from "homebridge"
export default class ComputerSpeakersAccessory implements AccessoryPlugin {
  private Service
  private Characteristic
  private computerSpeakers
  private speakerService?
  private fanService?
  private lightService?
  private volumeUpButtonService?
  private volumeDownService?
  private v
  constructor(logger: Logging, config: Config, api: API)
  getServices(): HAPService[]
  private notifyServicesOfVolume
  private notifyServicesOfMuteStatus
}
