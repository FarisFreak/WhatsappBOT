/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    prefix: string
  }
  export const config: Config
  export type Config = IConfig
}
