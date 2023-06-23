import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, isJidBroadcast, isJidUser, makeCacheableSignalKeyStore, makeInMemoryStore, proto, SignalDataSet, SignalDataTypeMap, useMultiFileAuthState, WAMessageContent, WAMessageKey } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import MAIN_LOGGER from '@whiskeysockets/baileys/lib/Utils/logger';
import NodeCache from 'node-cache';
import { Module } from './lib/Module';
import { Types as ModuleType } from './lib/Module/Types';

const logger = MAIN_LOGGER.child({});
logger.level = 'silent';

const msgRetryCounterCache = new NodeCache();

const useStore = !process.argv.includes('--no-store')
const store = useStore ? makeInMemoryStore({ logger }) : undefined;
store?.readFromFile('./baileys_store_multi.json');
setInterval(() => {
    store?.writeToFile('./baileys_store_multi.json')
}, 10_000);

const ModuleLoader = new Module.Loader(true);

const startSock = async() => {
    const {state, saveCreds} = await useMultiFileAuthState('baileys_auth_info');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);
    
    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        markOnlineOnConnect : false,
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        getMessage
    });

    store?.bind(sock.ev)
    
    sock.ev.process(async (events) => {
        
        if (events['connection.update']) {
            const update = events['connection.update'];
            const { connection, lastDisconnect } = update;

            if (connection === 'close'){
                if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut)
                    startSock();
                else
                    console.log('Connection closed. You are logged out.');
            }

            ModuleLoader.Filter.Type(ModuleType.Connection.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['connection.update']);
            })
        }

        if (events['creds.update']) {
            await saveCreds();

            ModuleLoader.Filter.Type(ModuleType.Creds.Update)
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messages.upsert']);
            });
        }

        if (events['presence.update']){
            ModuleLoader.Filter.Type(ModuleType.Creds.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['presence.update']);
            });
        }

        if (events['messages.upsert']){
            //Execute all 
            ModuleLoader.Filter.Type(ModuleType.Messages.Upsert);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messages.upsert']);
            });
            
        }

        if (events['messages.update']){
            ModuleLoader.Filter.Type(ModuleType.Messages.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messages.update']);
            });
        }

        if (events['messages.delete']){
            ModuleLoader.Filter.Type(ModuleType.Messages.Delete);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messages.delete']);
            });
        }

        if (events['messages.reaction']){
            ModuleLoader.Filter.Type(ModuleType.Messages.Reaction);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messages.reaction']);
            });
        }

        if (events['messages.media-update']){
            ModuleLoader.Filter.Type(ModuleType.Messages.MediaUpdate);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messages.media-update']);
            });
        }

        if (events['message-receipt.update']){
            ModuleLoader.Filter.Type(ModuleType.MessageReceipt.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['message-receipt.update']);
            });
        }

        if (events['messaging-history.set']){
            ModuleLoader.Filter.Type(ModuleType.MessagingHistory.Set);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['messaging-history.set']);
            });
        }

        if (events['chats.upsert']){
            ModuleLoader.Filter.Type(ModuleType.Chats.Upsert);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['chats.upsert']);
            });
        }

        if (events['chats.update']){
            ModuleLoader.Filter.Type(ModuleType.Chats.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['chats.update']);
            });
        }

        if (events['chats.delete']){
            ModuleLoader.Filter.Type(ModuleType.Chats.Delete);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['chats.delete']);
            });
        }

        if (events['call']){
            ModuleLoader.Filter.Type(ModuleType.Call);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['call']);
            });
        }

        if (events['call']){
            ModuleLoader.Filter.Type(ModuleType.Call);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['call']);
            });
        }

        if (events['contacts.upsert']){
            ModuleLoader.Filter.Type(ModuleType.Contacts.Upsert);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['contacts.upsert']);
            });
        }

        if (events['contacts.update']){
            ModuleLoader.Filter.Type(ModuleType.Contacts.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['contacts.update']);
            });
        }

        if (events['groups.upsert']){
            ModuleLoader.Filter.Type(ModuleType.Groups.Upsert);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['groups.upsert']);
            });
        }

        if (events['groups.update']){
            ModuleLoader.Filter.Type(ModuleType.Groups.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['groups.update']);
            });
        }
        
        if (events['group-participants.update']){
            ModuleLoader.Filter.Type(ModuleType.GroupParticipants.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['group-participants.update']);
            });
        }
        
        if (events['blocklist.set']){
            ModuleLoader.Filter.Type(ModuleType.Blocklist.Set);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['blocklist.set']);
            });
        }
        
        if (events['blocklist.update']){
            ModuleLoader.Filter.Type(ModuleType.Blocklist.Update);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['blocklist.update']);
            });
        }

        if (events['labels.edit']){
            ModuleLoader.Filter.Type(ModuleType.Labels.Edit);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['labels.edit']);
            });
        }

        if (events['labels.association']){
            ModuleLoader.Filter.Type(ModuleType.Labels.Association);
            const modules = ModuleLoader.FilterResult();

            modules.forEach(m => {
                m.execute(sock, events['labels.association']);
            });
        }
    });

    return sock;

    async function getMessage(key: WAMessageKey) : Promise<WAMessageContent | undefined> {
        if (store){
            const msg = await store.loadMessage(key.remoteJid!, key.id!);
            return msg?.message || undefined
        }

        return proto.Message.fromObject({});
    }
};

startSock();