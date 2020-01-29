#!/usr/bin/env nodejs
'use strict';
require('dotenv').config()
const mongo = require('./mongo');
const Cron = require('cron').CronJob;
const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

let logFileExtLength = 3; // i.e., 3 for .log; 2 for .md

let transporterConfig = {
	host: `${process.env.HOST}`,
	port: 587,
	secure: false,
	auth: {
		user: `${process.env.FROM}`,
		pass: `${process.env.PW}`
	},
	tls: {
		rejectUnauthorized: false
	}
};
let transporter = nodemailer.createTransport(transporterConfig);
 
const main = async() => {
	try{
		let logs = {};
		let logfileNames = await readdir(`${process.env.LOGSDIR}`);

		for(const name of logfileNames){
			let path = `${process.env.LOGSDIR}` + `${name}`;
			let content = await readFile(path, 'utf8');
			let extensionlessName = name.slice(0, (logFileExtLength * -1) - 1);
			logs[`${extensionlessName}`] = {
				file: name,
				content: content,
			}
		}

		await sendMail(formatLogsAsNodemailerAttachments(logs));

		await mongo.insert({
			date: Date().toString(),
			logs: logs
		});

	}
	catch(err){
		throw err;
	}
}

const formatLogsAsNodemailerAttachments = (logs) => {
	return Object.entries(logs).map(log => ({
			content: log[1].content,
			filename: log[1].file, 
			encoding: 'utf8'
		})
	)
}



const sendMail = async(attachments) => {
	await transporter.sendMail({
		from: `${process.env.FROM}`,
		to: `${process.env.TO}`,
		subject: 'Process Report',
		attachments: attachments
	});
}

main().catch((err) => {
	throw err;
})

// new Cron(process.env.CRON_INTERVAL, function() {
// 	main();
// }, null, true, 'Europe/Berlin');