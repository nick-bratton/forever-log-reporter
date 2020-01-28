#!/usr/bin/env nodejs
'use strict';
require('dotenv').config()
const Cron = require('cron').CronJob;
const nodemailer = require('nodemailer');

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

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

let interval = '15 10 * * MON';

const concatLogs = (logs) => {
	const reducer = (acc, cur) => {
		return acc + cur.type + '\n \n' + cur.data + '\n';
	}
	let content = logs.reduce(reducer, '');
	return content;
}

async function compileUTF8EncodedLogs(){
	try{
		let logTunnel = await readFile('./logs/tunnel.log', 'utf8');
		let logApp = await readFile('./logs/app.log', 'utf8');
		let logServer = await readFile('./logs/server.log', 'utf8');
		let concatenatedLogs = concatLogs([
			{type: "App log:", data: logApp},
			{type: "Server log:", data: logServer},
			{type: "Tunnel log:", data: logTunnel},
		]);
		return Buffer.from(concatenatedLogs, 'utf8');
	}
	catch(err){
		throw err;
	}
}
 
const main = async() => {
	try{
		let content = await compileUTF8EncodedLogs();
		await transporter.sendMail({
			from: `${process.env.FROM}`,
			to: `${process.env.TO}`,
			subject: 'test',
			subject: 'Process Report',
			attachments: [
				{
					content: content,
					filename: 'forever.log',
					encoding: 'base64'
				}
			]
		});
		/*

		and then here we need to 
		perform some mongo session action

		*/

	}
	catch(err){
		throw err;
	}
}

// new Cron(interval, function() {
// 	main();
// }, null, true, 'Europe/Berlin');

// dev: 
// main().catch(console.error);

const mongo = require('./mongo');

const getSession = async() => {
	try {
		let client = await mongo.getClient();
		let session = await mongo.getSession(client);
	}
	catch(err){
		throw err;
	}
}

getSession()
	.then(session => {
		try{

		}
		catch{

		}
	})