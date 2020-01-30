#!/usr/bin/env nodejs
'use strict';
require('dotenv').config()
const mongo = require('./mongo');
const mail = require('./mail')
const Cron = require('cron').CronJob;
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile)

let logFileExtLength = 3; // i.e., 3 for .log; 2 for .md
 
const main = async() => {
	try{
		let logs = {};
		let logFileNames = await readdir(`${process.env.LOGSDIR}`);

		for(const name of logFileNames){
			let path = `${process.env.LOGSDIR}` + `${name}`;
			let content = await readFile(path, 'utf8');
			let extensionlessName = name.slice(0, (logFileExtLength * -1) - 1);
			logs[`${extensionlessName}`] = {
				file: name,
				content: content,
			}
		}

		await mail.send(logs);

		await mongo.insert({
			date: Date().toString(),
			logs: logs
		});

		return logFileNames;

	}
	catch(err){
		throw err;
	}
}

const cleanup = async(logFileNames) => {
	try{
		for(const name of logFileNames){
			let path = `${process.env.LOGSDIR}` + name;
			await writeFile(path, '');
		}
	}
	catch(err){
		throw err;
	}
}

new Cron(process.env.CRON_INTERVAL, function() {
	main()
		.then(async logFileNames => {
			await cleanup(logFileNames);
		})
		.catch(err => {
			throw err;
		})
}, null, true, 'Europe/Berlin');



// dev test? 
// try: 
// main()
// 	.then(async logFileNames => {
// 		await cleanup(logFileNames);
// 	})
// 	.catch((err) => {
// 		throw err;
// 	})