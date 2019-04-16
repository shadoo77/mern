const mongoose = require('mongoose');

const db = require('../config/keys').mongoURI; //process.env.DATABASE_URL

mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB connection is successful!'))
	.catch((err) => console.log('Error with connection! ', err));

module.exports = mongoose;
