var express = require("express");
var router = express.Router();
//const { hashing, hashCompare } = require("../library/auth");
const { mongodb, MongoClient, dbUrl, dbName } = require("../dbConfig");

router.post("/addSales", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let dataBase = await client.db(dbName);
    let SalesHistory = await dataBase.collection("SalesHistory").findOne({
      selectedDate: req.body.selectedDate,
      owner: req.body.owner,
    });

    if (SalesHistory) {
      let updateSales = await dataBase.collection("SalesHistory").updateOne(
        {
          selectedDate: req.body.selectedDate,
          owner: req.body.owner,
        },

        {
          $set: {
            todaysSales: SalesHistory.todaysSales + req.body.paymentMoney,
            [`${req.body.paymentType}`]:
              SalesHistory[`${req.body.paymentType}`] + req.body.paymentMoney,
          },
        }
      );
      res.json({
        message: "Today's Sales Updated",
        data: await dataBase.collection("SalesHistory").findOne({
          selectedDate: req.body.selectedDate,
          owner: req.body.owner,
        }),
      });
    } else {
      let response = await dataBase
        .collection("SalesHistory")
        .insertOne(req.body);
      let updateSales = await dataBase.collection("SalesHistory").updateOne(
        {
          selectedDate: req.body.selectedDate,
          owner: req.body.owner,
        },

        {
          $set: {
            todaysSales: req.body.paymentMoney,
            [`${req.body.paymentType}`]: req.body.paymentMoney,
          },
        }
      );
      res.json({
        message: "Today's Sales Inserted",
        data: await dataBase.collection("SalesHistory").findOne({
          selectedDate: req.body.selectedDate,
          owner: req.body.owner,
        }),
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
    if (req.body.selectedDate == null) {
      console.log("................1", req.body.selectedDate);
      var findAllSales = await dataBase
        .collection("SalesHistory")
        .find({ owner: req.body.owner })
        .toArray();
    } else {
      console.log("................", req.params.date);

      var findAllSales = await dataBase.collection("SalesHistory").findOne({
        owner: req.body.owner,
        selectedDate: req.body.selectedDate,
      });
    }

    //upComing Feature. To limit the dates
    // ,selectedDate: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') }

    // count the records
    // var groupedSales = await dataBase
    //   .collection("SalesHistory")
    //   .count({ owner: req.body.owner });

    res.json({ data: findAllSales });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

// router.get("/getSales/:date", as);

module.exports = router;
