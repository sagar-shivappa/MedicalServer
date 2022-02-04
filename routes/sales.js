var express = require("express");
var router = express.Router();
const { hashing, hashCompare } = require("../library/auth");
const { mongodb, MongoClient, dbUrl, dbName } = require("../dbConfig");

router.post("/addSales", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let dataBase = await client.db(dbName);
    let SalesHistory = await dataBase
      .collection("SalesHistory")
      .findOne({ selectedDate: req.body.selectedDate, owner: req.body.owner });

    if (SalesHistory) {
      // res.json({ message: "Today's Sales Available" });
      console.log(SalesHistory);
      let r = SalesHistory.sales;
      let updateSales = await dataBase.collection("SalesHistory").updateOne(
        { selectedDate: req.body.selectedDate, owner: req.body.owner },
        {
          $set: {
            todaysSales: SalesHistory.todaysSales + req.body.todaysSales,
          },
        }
      );
      res.json({
        message: "Today's Sales Updated",
        updatedSales: SalesHistory.todaysSales + req.body.todaysSales,
      });
    } else {
      let status = await dataBase
        .collection("SalesHistory")
        .insertOne(req.body);
      res.json({
        message: "Today's Sales Inserted",
        updatedSales: req.body.todaysSales,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

router.post("/getSales", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let dataBase = await client.db(dbName);
    let SalesHistory = await dataBase
      .collection("SalesHistory")
      .find({ owner: req.body.owner })
      .toArray();
    res.json({ data: SalesHistory });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

module.exports = router;
