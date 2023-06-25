import { Module } from "../lib/Module/index.js";
import { Types as ModuleType } from "../lib/Module/Types.js";
import { BaileysEventMap } from "@whiskeysockets/baileys";
import { Config } from "../lib/Module/Config.js";

const Cfg : Config = {
    name: 'Mention All Member Group',
    command: 'all',
    prefix: '@',
    free: true,
    desc: 'command for mention all of group members',
    type: ModuleType.Messages.Upsert,
    disabled: false
};

export default new Module.Builder(Cfg, async (socks, data) => {
    const bData = data as BaileysEventMap['messages.upsert'];
    
    for (const m of bData.messages) {
        if (!m.key.participant)
            continue;

        const currentNumber = socks.user?.id.replace(/(?=:)(.*?)(?=@)/g, "");
        const groupdata = await socks.groupMetadata(m.key.remoteJid as string);

        const participants = groupdata.participants
            .filter(member => member.id !== currentNumber)
            .map(member => member.id);


        await socks.sendMessage(m.key.remoteJid as string, {
            text: participants.map(m => { return `@${m.split('@')[0]}`}).join(" "),
            mentions: participants
        }, {
            quoted: m
        });
    }
});