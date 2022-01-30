const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
dbName = "MedicalShop";
const dbUrl = `mongodb+srv://admin123:admin123@sagarshivappa.7afcf.mongodb.net/${dbName}`;

module.exports = { mongodb, MongoClient, dbUrl, dbName };
