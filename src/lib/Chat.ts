import {config} from 'node-config-ts';
import { proto } from '@whiskeysockets/baileys/WAProto/index.js';

export class Chat {
    private _message : proto.IMessage | string = '';
    private _textMessage? : string;

    constructor(msg: proto.IWebMessageInfo | string, private prefix? : string) {
        if (typeof msg === 'string')
            this._message = msg as string;
        else 
            this._message = (msg as proto.IWebMessageInfo).message as proto.IMessage;

        this.prefix = prefix ?? config.prefix;

        if (typeof this._message === 'string') {
            this._textMessage = this._message;
        } else {
            const msg = this._message as proto.IMessage;

            this._textMessage =
                msg.extendedTextMessage?.text ??
                msg.conversation ??
                msg.imageMessage?.caption ??
                msg.videoMessage?.caption ??
                msg.documentMessage?.caption ??
                '';
        }

    }
    public ContainsCommand (param: string) : boolean{
        let _message_split = this._textMessage?.split(' ');
        
        if (_message_split?.find(x => x == `${this.prefix}${param}`))
            return true;
        
        return false;
    }
    public Get = {
        Prefix : this.prefix,
        Message : () => this._message,
        Command : () : string => {
            let _cmd : string = this._textMessage?.split(' ')[0] ?? '';
            let output : string = _cmd[0] == this.prefix ? _cmd.replace(this.prefix, '') : '';

            return output;
        },
        Value : (defaultValue?: string) => {
            let _value : string | undefined = '' as string;
            
            if (!this.Get.Command())
                return null;

            _value = typeof this._message === 'string' ?
                this._message.replace(this.prefix as string + this.Get.Command() as string + ' ', '')
                :
                (this._message as proto.IMessage).conversation?.replace(this.prefix as string + this.Get.Command() as string + ' ', '');

            if (!_value)
                return defaultValue;

            return _value;
        }
    }
}