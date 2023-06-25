import {config} from 'node-config-ts';
import { proto } from '@whiskeysockets/baileys/WAProto/index.js';

export class Chat {
    private _message : proto.IMessage | string = '';
    private _prefix? : string;
    private _command? : string;
    private _value? : string;

    private _textMessage? : string;

    constructor(msg: proto.IWebMessageInfo | string, prefix? : string) {
        if (typeof msg === 'string')
            this._message = msg as string;
        else 
            this._message = (msg as proto.IWebMessageInfo).message as proto.IMessage;

        this._prefix = prefix ? prefix : config.prefix;

        if (typeof this._message === 'string') {
            this._textMessage = this._message;
        } else {
            if (this._message.extendedTextMessage)
                this._textMessage = ((this._message as proto.IMessage).extendedTextMessage?.text as string);
            else if (this._message.conversation)
                this._textMessage = ((this._message as proto.IMessage).conversation as string);
            else if (this._message.imageMessage?.caption)
                this._textMessage = ((this._message as proto.IMessage).imageMessage?.caption as string);
            else if (this._message.videoMessage?.caption)
                this._textMessage = ((this._message as proto.IMessage).videoMessage?.caption as string);
            else if (this._message.documentMessage?.caption)
                this._textMessage = ((this._message as proto.IMessage).documentMessage?.caption as string);
        }

    }
    public ContainsCommand (param: string) : boolean{
        let _message_split = this._textMessage?.split(' ');
        
        if (_message_split?.find(x => x == `${this._prefix}${param}`))
            return true;
        
        return false;
    }
    public Get = {
        Prefix : this._prefix,
        Message : () => { return this._message; },
        Command : () => {
            let _message_split = this._textMessage?.split(' ');

            let _cmd: string = '';
            if (_message_split)
                _cmd = _message_split[0];

            if (_cmd[0] == this._prefix)
                this._command = _cmd.replace(this._prefix, '');

            return this._command;
        },
        Value : (defaultValue?: string) => {
            if (this.Get.Command() == null || this.Get.Command()?.length == 0 || this.Get.Command() == '')
                return null;

            if (typeof this._message === 'string')
                this._value = this._message.replace(this._prefix as string + this._command as string + ' ', '');
            else
                this._value = (this._message as proto.IMessage).conversation?.replace(this._prefix as string + this._command as string + ' ', '');
            
            if (this._value?.length == 0 || this._value == "" || this._value == null)
                return defaultValue;
            
            return this._value;
        }
    }
}