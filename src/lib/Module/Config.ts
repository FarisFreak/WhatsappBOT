import { Types } from "./Types.js";

export declare type Config = {
    name: string,
    command?: string,
    prefix?: string,
    free?: boolean,
    desc: string,
    type: string | typeof Types,
    disabled?: boolean,
    hide?: boolean
}