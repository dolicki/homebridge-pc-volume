import { LogLevel } from "homebridge"
export default class MockLogging {
  prefix: string
  constructor(prefix?: string)
  info(message: string, ...parameters: any[]): void
  warn(message: string, ...parameters: any[]): void
  error(message: string, ...parameters: any[]): void
  debug(message: string, ...parameters: any[]): void
  log(level: LogLevel, message: string, ...parameters: any[]): void
}
