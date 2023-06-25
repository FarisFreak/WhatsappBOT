import { Module } from "../lib/Module/index.js";
import { Types as ModuleType } from "../lib/Module/Types.js";
import { BaileysEventMap } from "@whiskeysockets/baileys";
import { Config } from "../lib/Module/Config.js";

const Cfg : Config = {
    name: 'Ping Command',
    command: 'ping',
    desc: 'response chat with \'Pong!\'',
    type: ModuleType.Messages.Upsert,
    disabled: false
};

export default new Module.Builder(Cfg, (socks, data) => {
    const bData = data as BaileysEventMap['messages.upsert'];

    bData.messages.forEach(m => {
        socks.sendMessage(m.key.remoteJid as string, {text: "Pong!"});
    });
});