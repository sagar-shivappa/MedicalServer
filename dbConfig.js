const { MongoClient } = require("mongodb");

module.exports = {
  dbName: null,
  async connect() {
    try {
      //connecting MongoDB
      const client = new MongoClient(process.env.mongo_url);
      await client.connect();
      console.log("MongoDB Connected");

      //Selecting the DB
      this.dbName = await client.db(process.env.dbName);
      console.log(`selected DB Name - ${process.env.dbName}`);
    } catch (error) {
      console.log("DB Connection issue", error);
      process.exit();
    }
  },
  collectionConnection(name) {
    return this.dbName.collection(name);
  },
};
