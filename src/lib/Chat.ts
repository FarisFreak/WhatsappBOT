import {config} from 'node-config-ts';
import { proto } from '@whiskeysockets/baileys/WAProto/index';

export class Chat {
    private _message : proto.IMessage | string;
    private _prefix? : string;
    private _command? : string;
    private _value? : string;

    constructor(msg: proto.IWebMessageInfo | string) {
        if (typeof msg === 'string')
            this._message = msg as string;
        else 
            this._message = (msg as proto.IWebMessageInfo).message as proto.IMessage;

        this._prefix = config.prefix;
    }

    public Get = {
        Prefix : this._prefix,
        Message : () => { return this._message; },
        Command : () => {
            let _message_split;
            if (typeof this._message === 'string') {
                _message_split = this._message.split(' ');
            } else {
                if (this._message.extendedTextMessage == null)
                    _message_split = ((this._message as proto.IMessage).conversation as string).split(' ');
                else
                    _message_split = ((this._message as proto.IMessage).extendedTextMessage?.text as string).split(' ');
            }

            const _cmd = _message_split[0];
            if (_cmd[0] == this._prefix) {
                this._command = _cmd.replace(this._prefix, '');
            }
            
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