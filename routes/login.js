var express = require("express");
var router = express.Router();
const { hashing, hashCompare } = require("../library/auth");
const { mongodb, MongoClient, dbUrl, dbName } = require("../dbConfig");

/* GET users listing. */
router.post("/register", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let dataBase = await client.db(dbName);
    let User = await dataBase
      .collection("UserDetails")
      .findOne({ gmail: req.body.gmail });
    if (User) {
      res.json({ message: "User Exsists" });
    } else {
      const hash = await hashing(req.body.passWord);
      req.body.password = hash;
      let User = await dataBase.collection("UserDetails").insertOne(req.body);
      res.json({ message: "User Account Created" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let dataBase = await client.db(dbName);
    let User = await dataBase
      .collection("UserDetails")
      .findOne({ gmail: req.body.userName });
    console.log(User);
    if (User) {
      // res.json({ message: "User Exsists" });
      const hashComp = await hashCompare(req.body.passWord, User.password);
      if (hashComp) {
        res.json({ message: "LogIn Success" });
      } else {
        res.json({ message: "InCorrect password" });
      }
    } else {
      // const hash = await hashing(req.body.password);
      // req.body.password = hash;
      // let User = await dataBase.collection("Register").insertOne(req.body);
      res.json({ message: "User Doesn't Exsist" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

module.exports = router;
