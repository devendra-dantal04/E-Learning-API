import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  transports: [
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/combined.log" }),
    new transports.Console(),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf((info) => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
});

export default logger;
