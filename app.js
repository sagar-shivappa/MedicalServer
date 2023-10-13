var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var { config } = require("dotenv");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var SalesRouter = require("./routes/sales");
var StocksRouter = require("./routes/stocks");
var BillsRouter = require("./routes/bills");

var app = express();
config();

//Importing DB Config File
const mongoConfig = require("./dbConfig");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

(async () => {
  try {
    await mongoConfig.connect();
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/medical", loginRouter);
    app.use("/sales", SalesRouter);
    app.use("/stocks", StocksRouter);
    app.use("/bill", BillsRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  } catch (error) {
    console.log("Problem while initializing the app", error);
  }
})();

module.exports = app;
