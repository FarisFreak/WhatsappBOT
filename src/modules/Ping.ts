import { Module } from "../lib/Module";
import { Types as ModuleType } from "../lib/Module/Types";
import { BaileysEventMap } from "@whiskeysockets/baileys";
import { Config } from "../lib/Module/Config";

const Cfg : Config = {
    name: 'Ping Command',
    command: 'ping',
    desc: 'response chat with \'Pong!\'',
    type: ModuleType.Messages.Upsert,
    disabled: false
};

module.exports = new Module.Builder(Cfg, (socks, data) => {
    const bData = data as BaileysEventMap['messages.upsert'];

    bData.messages.forEach(m => {
        socks.sendMessage(m.key.remoteJid as string, {text: "Pong!"});
    });
});