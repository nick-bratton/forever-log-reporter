# Forever Log Reporter

This code base offers a small utility to backup logs from [forever](https://www.npmjs.com/package/forever)-ized Node processes to a [Mongo](https://www.mongodb.com/) database instance and send process reports via email. The timing of the backups and report emails is easily configuralble via [Cron](https://en.wikipedia.org/wiki/Cron). 

# Table of Contents

* [Installation](#Installation)
* [Configuration](#Configuration)
* [Launch](#Launch)

# Installation

After cloning, run 

`npm install` 

to install:

* [cron](https://www.npmjs.com/package/cron)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [mongodb](https://www.npmjs.com/package/mongodb)
* [nodemailer](https://www.npmjs.com/package/nodemailer)

Feel free to use the Yarn package manager at your own risk.

# Configuration

Beyond that, the script is configurable across the following entrypoints:

## .env.example

The `.env` file contains your authorization tokens, MongoDB configuration parameters, and Cron interval definition. **You need to change the name of the file from `.env.example` to `.env` after cloning.**

## forever/config.example.json

This file contains configuration for the Node process manager forever. **You need to change the name of this file from `config.example.json` to `config.json` after cloning.**

# Launch


To start the process, simply run:

```forever start forever/config.json```

from the root directory of this code base.