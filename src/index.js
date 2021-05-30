import express from "express";
import bodyParser from "body-parser";
import winston from "winston";
import logger from "./lib/logger";
import settings from "./lib/settings";

import router from "./Router";
const schema = require("./qraphql/schema");
const graphqlHTTP = require("express-graphql");
const app = express();

app.use(express.static("public/content"));

app.all("*", (req, res, next) => {
  // CORS headers

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization , x-access-token"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", router);

app.use(logger.sendResponse);

//This route will be used as an endpoint to interact with Graphql,
//All queries will go through this route.
app.use(
  "/graphql",
  graphqlHTTP({
    //Directing express-graphql to use this schema to map out the graph
    schema,
    //Directing express-graphql to use graphiql when goto '/graphql' address in the browser
    //which provides an interface to make GraphQl queries
    graphiql: true,
  })
);

const server = app.listen(settings.apiListenPort, () => {
  const serverAddress = server.address();
  winston.info(`API running at http://localhost:${serverAddress.port}`);
});
