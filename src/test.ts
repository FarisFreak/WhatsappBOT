// import path from 'path';
// import fs from 'fs';

// import { CommandBuilder, ModuleType } from './lib/ModuleBuilder';

// const listCommands = [];
// const listBase = [];

// //#region Read all Command files
// const commandsPath = path.join(__dirname, 'modules/commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);

// 	// console.log(command);
// 	// Set a new item in the Collection with the key as the command name and the value as the exported module
// 	if ('data' in command && 'execute' in command) {
// 		if (!(command.data.param == null || command.data.param == '' && 'param' in command.data == false))
// 			if (!command.data.disabled)
// 				listCommands.push(command);
// 	} else {
// 		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 	}
// }
// //#endregion

// //#region Read all Base files
// // const basesPath = path.join(__dirname, 'modules/base');
// // console.log(fs.readdirSync(basesPath));
// // const baseFiles = fs.readdirSync(basesPath).filter(file => file.endsWith('.js'));

// // for (const file of baseFiles) {
// // 	const filePath = path.join(basesPath, file);
// // 	const base = require(filePath);
// // 	// Set a new item in the Collection with the key as the command name and the value as the exported module
// // 	if ('data' in base && 'execute' in base) {    
// //         listBase.push(base);
// // 	} else {
// // 		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// // 	}
// // }
// //#endregion

// const del = listCommands.filter(x => x.data.type == ModuleType.Messages.Upsert);
// console.log(del)
// // del.forEach(mod => {
// //     mod.execute(() => {console.log(1);}, "hola");
// // });
// console.log(listCommands);

// // import {Chats} from './lib/Core';
// // import { proto } from '@whiskeysockets/baileys/WAProto/index';
// // const chats = new Chats("/ping mantap anjeng");
// // const cCMD = chats.Get.Command();
// // const cVAL = chats.Get.Value();

// // console.log(cCMD);
// // console.log(cVAL);

import { Module } from "./lib/Module";
import { ModuleType } from "./lib/ModuleBuilder";

const ModuleLoader = new Module.Loader();

ModuleLoader.Filter.Type(ModuleType.Messages.Upsert);
ModuleLoader.Filter.Param.Null(false);

const modules = ModuleLoader.FilterResult();

console.log(modules);


// import { Chats } from "./lib/Chats";

// const chat = new Chats("/hello world mantap anjer");
// console.log(chat.Get.Value());