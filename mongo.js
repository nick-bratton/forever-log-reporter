require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

exports.getClient = async() => {
	try{
		const client = new MongoClient(`${process.env.MONGOURL}`, {
			useUnifiedTopology: true
		});
		return await client.connect();
	}
	catch(err){
		throw err;
	}
}

exports.getSession = async(client) => {
	try{ 
		return await client.startSession();
	}
	catch(err){
		throw (err);
	}
}

// startMongoSession()