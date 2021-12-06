const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const helper = require("./utils/list_helper");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  // console.log("res:", response.body);
  next();
};
//logger.info("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}); /*
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });
*/
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

//app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// You can set morgan to log differently depending on your environment
app.use(middleware.unknownEndpoint);
//app.use(middleware.errorHandler);

module.exports = app;
