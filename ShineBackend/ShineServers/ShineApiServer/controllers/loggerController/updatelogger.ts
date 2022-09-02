import db from "../../utils/mongoClient.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import Logger from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";
import sendLoggerToLogFlusherServer from "../../WocketClients/wocketLogFLusherClient.ts";
import {encrypt} from "../../../Shared/cipher.ts";

const updatelogger = async (ctx: RouterContext) => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "Invalid data",
      };
    } else {
      const x = await ctx.request.body().value;
      const loggerName = ctx.params.loggerName;
      const mainLogger = await db!.collection<Logger>(LOGGERCOLLECTION);
      const logger = await db!.collection<Logger>(LOGGERCOLLECTION).findOne({
        loggerName: loggerName,
      });
      if (!logger) {
        ctx.response.status = 404;
        ctx.response.body = {
          msg: "Logger not found",
        };
        return;
      }
      if (logger) {
        const emailFromPassword = x.emailFromPassword != undefined
          ? encrypt(x.emailFromPassword)
          : null;
        const updateData = {
          description: x.description ?? logger.description,
          isRollingFile: x.isRollingFile ?? logger.isRollingFile,
          rollingLogDirectorypath: x.rollingLogDirectorypath ??
            logger.rollingLogDirectorypath,
          isEmail: x.isEmail ?? logger.isEmail,
          emailLogLevel: x.emailLogLevel ?? logger.emailLogLevel,
          emailToPrimary: x.emailToPrimary ?? logger.emailToPrimary,
          emailToSecondary: x.emailToSecondary ?? logger.emailToSecondary,
          emailFrom: x.emailFrom ?? logger.emailFrom,
          emailFromPassword: emailFromPassword ?? logger.emailFromPassword,
          isFlushLogs: x.isFlushLogs ?? logger.isFlushLogs,
          flushIntervalCronExpression: x.flushIntervalCronExpression ??
            logger.flushIntervalCronExpression,
          updatedAt: new Date(),
          createdAt: logger.createdAt,
        };
        await mainLogger.updateOne({
          loggerName: loggerName,
        }, {
          $set: updateData,
        });

        const logflusherData = updateData;
        logflusherData.loggerName = loggerName;
        logflusherData.operation = "update";
        await sendLoggerToLogFlusherServer(logflusherData);

        ctx.response.status = 201;
        ctx.response.body = {
          msg: `Logger ${loggerName} updated successfully`,
          data: updateData,
        };
      }
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      msg: error.message,
    };
  }
};

export default updatelogger;
