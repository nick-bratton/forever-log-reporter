#!/usr/bin/env nodejs
'use strict';
require('dotenv').config()
const mongo = require('./mongo');
const Cron = require('cron').CronJob;
const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

let interval = '15 10 * * MON';

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

		let appLog = await readFile('./logs/app.log', 'utf8');
		let serverLog = await readFile('./logs/server.log', 'utf8');
		let tunnelLog = await readFile('./logs/tunnel.log', 'utf8');

		await transporter.sendMail({
			from: `${process.env.FROM}`,
			to: `${process.env.TO}`,
			subject: 'Process Report',
			attachments: [
				{
					content: appLog,
					filename: 'app.log',
					encoding: 'base64'
				},
				{
					content: serverLog,
					filename: 'server.log',
					encoding: 'base64'
				},
				{
					content: tunnelLog,
					filename: 'tunnel.log',
					encoding: 'base64'
				}
			]
		});
		let doc = {
			date: Date().toString(),
			logs: {
				app: appLog,
				server: serverLog,
				tunnel: tunnelLog,
			}
		}
		await mongo.insert(doc);
	}
	catch(err){
		throw err;
	}
}

main().catch((err) => {
	throw err;
})

// new Cron(interval, function() {
// 	main();
// }, null, true, 'Europe/Berlin');