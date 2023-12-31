import makeWASocket, { AuthenticationCreds, BaileysEventMap, Chat, ChatUpdate, ConnectionState, Contact, GroupMetadata, MessageUpsertType, MessageUserReceiptUpdate, ParticipantAction, PresenceData, proto, WACallEvent, WAMessage, WAMessageKey, WAMessageUpdate } from "@whiskeysockets/baileys";
import type { Boom } from '@hapi/boom';
import { Config } from "./Config.js";
import { Types } from "./Types.js";
import path from 'path';
import fs from 'fs';
import { Label } from "@whiskeysockets/baileys/lib/Types/Label.js";
import { LabelAssociation } from "@whiskeysockets/baileys/lib/Types/LabelAssociation.js";
import { Chat as ChatModule } from "../Chat.js";
import CliTable3 from "cli-table3";
import colors from "@colors/colors";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export namespace Module {
    export declare type ExecutionData =
    | WAMessage
    | Partial<ConnectionState>
    | Partial<AuthenticationCreds>
    | {
        chats: Chat[];
        contacts: Contact[];
        messages: WAMessage[];
        isLatest: boolean;
        }
    | Chat[]
    | ChatUpdate[]
    | string[]
    | {
        id: string;
        presences: {
            [participant: string]: PresenceData;
        };
        }
    | Contact[]
    | Partial<Contact>[]
    | {
        keys: WAMessageKey[];
        }
    | {
        jid: string;
        all: true;
        }
    | WAMessageUpdate[]
    | {
        key: WAMessageKey;
        media?: {
            ciphertext: Uint8Array;
            iv: Uint8Array;
        };
        error?: Boom;
        }[]
    | {
        messages: WAMessage[];
        type: MessageUpsertType;
        }
    | {
        key: WAMessageKey;
        reaction: proto.IReaction;
        }[]
    | MessageUserReceiptUpdate[]
    | GroupMetadata[]
    | Partial<GroupMetadata>[]
    | {
        id: string;
        participants: string[];
        action: ParticipantAction;
        }
    | {
        blocklist: string[];
        }
    | {
        blocklist: string[];
        type: 'add' | 'remove';
        }
    | WACallEvent[]
    | Label
    | {
        association: LabelAssociation;
        type: 'add' | 'remove';
        };

    export class Builder {
        constructor(
            config: Config,
            execute: (socks: ReturnType<typeof makeWASocket.default>, data: ExecutionData, glob: any) => void
        ) {
            if (!('disabled' in config)) {
                config.disabled = false;
            }

            if (!('hide' in config))
                config.hide = false;

            const buildData = {
                data: config,
                execute: (socks: ReturnType<typeof makeWASocket.default>, data: ExecutionData, glob: any) => {
                    const { type, command } = config;

                    if (type !== Types.Messages.Upsert) {
                        execute(socks, data, glob);
                    } else {
                        const baseData = data as BaileysEventMap['messages.upsert'];

                        // for (const msg of baseData.messages){
                        //     if (command && command !== ''){
                        //         if (msg.broadcast || msg.key.fromMe)
                        //             continue;

                        //         if (!msg.messageStubParameters == null)
                        //             continue;

                        //         const chatCmd = new ChatModule(msg, config.prefix);
                        //         if (!((config.free && chatCmd.ContainsCommand(config.command as string)) || (chatCmd.Get.Command() === command)))
                        //             continue;
                        //     }
                        //     execute(socks, msg, glob);
                        // }

                        // for (const msg of baseData.messages){
                        //     if (command && command !== ''){
                        //         if (msg.broadcast || msg.key.fromMe)
                        //             continue;
                                
                        //         if (!msg.messageStubType){
                        //             const chatCmd = new ChatModule(msg, config.prefix);
                        //             if ((config.free && chatCmd.ContainsCommand(config.command as string)) || (chatCmd.Get.Command() === command))
                        //                 execute(socks, msg, glob);
                        //         }
                        //     } else {
                        //         execute(socks, msg, glob);
                        //     }
                        // }

                        

                        if (command && command !== '') {
                            baseData.messages.forEach(msg => {
                                if (msg.broadcast || msg.key.fromMe) {
                                    return;
                                }

                                if (msg.messageStubType == null && msg.messageStubType == undefined){
                                    const chatCmd = new ChatModule(msg, config.prefix);
                                    if ((config.free && chatCmd.ContainsCommand(config.command as string)) || (chatCmd.Get.Command() === command)){
                                        execute(socks, msg, glob);
                                    }
                                }
                            });
                        } else {
                            baseData.messages.forEach(msg => {
                                execute(socks, msg, glob);
                            });
                        }
                    }
                },
            };

            return buildData;
        }
    }

    export class Loader {
        protected _AllList: any[] = [];
        protected _List: any[] = [];
        protected filteredModules: any[] = [];
        protected isFiltered: boolean = false;

        get List(): any[] {
            return this._List;
        }

        constructor(showTable: boolean = false) {
            const modulesPath = path.join(__dirname, '../../modules');
            const modulesFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith('.js'));

            (async() => {
                for (const file of modulesFiles) {
                    const filePath = path.join(modulesPath, file);
                    const _module = await import( `${process.platform === "win32" ? "file:///" : ""}${filePath}`);
                    const module = _module.default;
    
                    if ('data' in module && 'execute' in module) {
                        if (!module.data.disabled && !module.data.hide) 
                            this._List.push(module);
    
                        if (!module.data.hide)
                            this._AllList.push(module);
                    } else {
                        console.log(`[WARNING] The module at ${filePath} is missing a required "data" or "execute" property. module disabled.`);
                    }
                }
    
                if (showTable){
                    let table = new CliTable3({
                        head: [colors.cyan('Module Name'), colors.cyan('Type'), colors.cyan('Description'), colors.cyan('Status')]
                    });
        
                    this._AllList.sort((a: any, b: any) => {
                        if (a.data.name < b.data.name && a.data.type < b.data.type)
                            return -1;
    
                        if (a.data.name > b.data.name && a.data.type > b.data.type)
                            return 1;
    
                        return 0;
                    });
    
                    this._AllList.forEach(module => {
                        table.push([colors.green(module.data.name), colors.yellow(module.data.type), module.data.desc, module.data.disabled ? colors.bgRed.white("Disabled"): colors.bgGreen.white("Enabled")]);
                    });
        
                    console.log(table.toString());
                }
            })();

        }

        Filter = {
            Type: (type: string | typeof Types) => {
                this.filteredModules = this.filteredModules.length < 1
                    ? this._List.filter(x => x.data.type == type)
                    : this.filteredModules.filter(x => x.data.type == type);

                this.isFiltered = true;
            },
            Param: {
                Null: (cond: boolean = true) => {
                    this.filteredModules = this.filteredModules.length < 1
                    ? cond
                        ? this._List.filter(x => x.data.param == null || x.data.param == '' || !('param' in x.data))
                        : this._List.filter(x => x.data.param != null && x.data.param != '' && ('param' in x.data))
                    : cond
                        ? this.filteredModules.filter(x => x.data.param == null || x.data.param == '' || !('param' in x.data))
                        : this.filteredModules.filter(x => x.data.param != null && x.data.param != '' && ('param' in x.data));

                    this.isFiltered = true;
                },
                Value: (value: string) => {
                    this.filteredModules = this.filteredModules.length < 1
                    ? this._List.filter(x => x.data.param == value && ('param' in x.data))
                    : this.filteredModules.filter(x => x.data.param == value && ('param' in x.data));

                    this.isFiltered = true;
                }
            }
        };

        FilterResult(clear: boolean = true) {
            const result = (this.filteredModules.length < 1 && !this.isFiltered) ? this._List : this.filteredModules;
            if (clear) {
                this.filteredModules = [];
                this.isFiltered = false;
            }
            return result;
        }
    }
}
