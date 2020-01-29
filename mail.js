#!/usr/bin/env nodejs
'use strict';
require('dotenv').config()
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

const formatLogsAsNodemailerAttachments = (logs) => {
	return Object.entries(logs).map(log => ({
			content: log[1].content,
			filename: log[1].file, 
			encoding: 'utf8'
		})
	)
}

exports.send = async(logs) => {
	await transporter.sendMail({
		from: `${process.env.FROM}`,
		to: `${process.env.TO}`,
		subject: 'Process Report',
		attachments: formatLogsAsNodemailerAttachments(logs)
	});
}