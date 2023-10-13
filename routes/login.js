var express = require("express");
var router = express.Router();
const { hashing, hashCompare } = require("../library/auth");
const dbConfig = require("./../dbConfig");
const { status } = require("express/lib/response");

/* GET users listing. */
router.post("/register", async (req, res) => {
  try {
    let User = await dbConfig
      .collectionConnection(process.env.adminCollection)
      .findOne({ gmail: req.body.gmail });
    if (User) {
      res.json({ message: "User Exsists" });
    } else {
      const hash = await hashing(req.body.passWord);
      req.body.passWord = hash;
      await dbConfig
        .collectionConnection(process.env.adminCollection)
        .insertOne(req.body);
      res.json({ message: "User Account Created" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    let User = await dbConfig
      .collectionConnection(process.env.adminCollection)
      .findOne({ phoneNumber: req.body.phoneNumber });
    if (User) {
      const hashComp = await hashCompare(req.body.passWord, User.passWord);
      if (hashComp) {
        res.json({
          message: "LogIn Success",
          nickName: User.userName,
          shopId: User.phoneNumber,
        });
      } else {
        res.json({ message: "Incorrect password" });
      }
    } else {
      res.status(400).json({ message: "Incorrect password or User" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
