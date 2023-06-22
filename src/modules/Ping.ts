import { Module } from "../lib/Module";
import { Types as ModuleType } from "../lib/Module/Types";
import { proto } from '@whiskeysockets/baileys/WAProto/index';
import { AnyMessageContent, BaileysEventMap } from "@whiskeysockets/baileys";
import { Chat } from "../lib/Chat";
import { Config } from "../lib/Module/Config";
import { config } from "node-config-ts";

const Cfg : Config = {
    name: 'Ping Command',
    param: 'ping',
    desc: 'Command Desc',
    type: ModuleType.Messages.Upsert,
    disabled: false
};

module.exports = new Module.Builder(Cfg, (socks, data) => {
    const bData = data as BaileysEventMap['messages.upsert'];
    
    bData.messages.forEach(m => {
        socks.sendMessage(m.key.remoteJid as string, {text: "Pong!"});
    });
});