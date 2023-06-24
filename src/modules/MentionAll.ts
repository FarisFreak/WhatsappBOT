import { Module } from "../lib/Module";
import { Types as ModuleType } from "../lib/Module/Types";
import { BaileysEventMap } from "@whiskeysockets/baileys";
import { Config } from "../lib/Module/Config";

const Cfg : Config = {
    name: 'Mention All Member Group',
    command: 'all',
    prefix: '@',
    free: true,
    desc: 'command for mention all of group members',
    type: ModuleType.Messages.Upsert,
    disabled: false
};

module.exports = new Module.Builder(Cfg, (socks, data) => {
    const bData = data as BaileysEventMap['messages.upsert'];
    
    bData.messages.forEach(async m => {
        let participants: string[] = [];
        let textParticipants: string = "";

        let currentNumber = socks.user?.id.replace(/(?=:)(.*?)(?=@)/g, "");

        if (m.key.participant != null && m.key.participant != undefined){
            let groupdata = await socks.groupMetadata(m.key.remoteJid as string);

            groupdata.participants.forEach(member => {
                if (member.id != currentNumber){
                    participants.push(member.id);
                    textParticipants += `@${member.id.split('@')[0]} `;
                }

            })
            await socks.sendMessage(m.key.remoteJid as string, {text: textParticipants, mentions: participants}, {quoted : m});
        }
    });
});