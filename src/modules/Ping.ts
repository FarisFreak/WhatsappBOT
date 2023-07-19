import { Module } from "../lib/Module/index.js";
import { Types as ModuleType } from "../lib/Module/Types.js";
import { WAMessage } from "@whiskeysockets/baileys";
import { Config } from "../lib/Module/Config.js";

const Cfg : Config = {
    name: 'Ping Command',
    command: 'ping',
    desc: 'response chat with \'Pong!\'',
    type: ModuleType.Messages.Upsert,
    disabled: false
};

export default new Module.Builder(Cfg, async (socks, data) => {
    const message = data as WAMessage;

    await socks.sendMessage(message.key.remoteJid as string, {text: "Pong!"}, {quoted: message});
});