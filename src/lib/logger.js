import winston from "winston";
const LOGS_FILE = "logs/server.log";

winston.configure({
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      level: "info",
      handleExceptions: true,
      format: winston.format.json(),
      filename: LOGS_FILE,
      maxsize: 5242880,
      maxFiles: 10,
    }),
  ],
});

const getResponse = (message) => ({
  status: false,
  message,
});

const sendResponse = (err, req, res, next) => {
  if (err) {
    winston.error(err.stack);
    res.send(getResponse(err.message));
  } else {
    next();
  }
};

export default {
  sendResponse,
};
