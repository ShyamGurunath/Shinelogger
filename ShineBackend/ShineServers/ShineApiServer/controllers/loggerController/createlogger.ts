import db from "../../utils/mongoClient.ts";
import Logger from "../../interfaces/logger.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";
import Log from "../../interfaces/log.ts";
import sendLoggerToLogFlusherServer from "../../WocketClients/wocketLogFLusherClient.ts";

const createlogger = async (ctx: RouterContext) => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "Invalid data",
      };
    } else {
      const x = await ctx.request.body().value;
      // loggerCollection is the name of the collection in mongo db where we will store the loggers
      const loggerCollection = await db.collection<Logger>(LOGGERCOLLECTION);
      // NewCollection is created under the name of the x.loggerName to store logController
      await db!.collection<Log>(x.loggerName);
      // check if loggerName already exists
      const logger = await db!.collection(LOGGERCOLLECTION).findOne({
        loggerName: x.loggerName,
      });
      if (logger) {
        ctx.response.status = 400;
        ctx.response.body = {
          msg: "LoggerName already exists",
        };
        return;
      }
      const datetime = new Date();
      const loggerData = {
        loggerName: x.loggerName,
        description: x.description,
        isRollingFile: x.isRollingFile,
        rollingLogDirectorypath: x.rollingLogDirectorypath === undefined
          ? ""
          : x.rollingLogDirectorypath,
        isEmail: x.isEmail,
        emailLogLevel: x.emailLogLevel === undefined ? "INFO" : x.emailLogLevel,
        emailToPrimary: x.emailToPrimary === undefined ? "" : x.emailToPrimary,
        emailFrom: x.emailFrom === undefined ? "" : x.emailFrom,
        emailFromPassword: x.emailFromPassword === undefined
          ? ""
          : x.emailFromPassword,
        emailToSecondary: x.emailToSecondary === undefined
          ? ""
          : x.emailToSecondary,
        isFlushLogs: x.isFlushLogs,
        flushIntervalCronExpression: x.flushIntervalCronExpression === undefined
          ? ""
          : x.flushIntervalCronExpression,
        createdAt: datetime,
        updatedAt: datetime,
      };
      await loggerCollection.insertOne(loggerData);
      if (x.isFlushLogs) {
        const logflusherData = loggerData;
        logflusherData.operation = "create";
        await sendLoggerToLogFlusherServer(logflusherData);
      }
      ctx.response.status = 201;
      ctx.response.body = {
        msg: "Logger created successfully",
        data: loggerData,
      };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      msg: error.message,
    };
  }
};
export default createlogger;
