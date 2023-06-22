import { Types } from "./Types";

export declare type Config = {
    name: string,
    param?: string,
    desc: string,
    type: string | typeof Types,
    disabled?: boolean,
}