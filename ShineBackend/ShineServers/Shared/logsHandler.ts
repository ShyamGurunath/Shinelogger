import {log} from "../Shared/deps.ts";
import {mkdirSync,existsSync} from "../Shared/deps.ts";

const LogsDirectory = "../../logs";

if (!existsSync(LogsDirectory)) {
  mkdirSync(LogsDirectory);
}

await log.setup({
    //define handlers
    handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG", {
            formatter: "{datetime} {levelName} {msg}"
        }),
        file: new log.handlers.RotatingFileHandler('DEBUG', {
            filename: `${LogsDirectory}/app.log`,
            maxBytes: 100000,
            maxBackupCount: 5,
            formatter: rec => JSON.stringify({region: rec.loggerName, ts: rec.datetime, level: rec.levelName, data: rec.msg})})
    },

    //assign handlers to loggers
    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["console", "file"],
        }
    },
});
const logging = log.getLogger();

logging.info("Logging initialized");

export default logging;