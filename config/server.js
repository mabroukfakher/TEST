// config used by server side only
const dbHost = "127.0.0.1";
const dbPort = 27017;
const dbName = "GRHSatoripop";
const dbUser = "";
const dbPass = "";
const dbCred =
  dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : "";

const dbUrl =
  process.env.DB_URL || `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}`;

module.exports = {
  apiListenPort: 3001,
  mongodbServerUrl: dbUrl,
  // key to sign tokens
  jwtSecretKey: "-",
};
