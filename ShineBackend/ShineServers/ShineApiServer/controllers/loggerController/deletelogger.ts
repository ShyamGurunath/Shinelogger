import db from "../../utils/mongoClient.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";
import sendLoggerToLogFlusherServer from "../../WocketClients/wocketLogFLusherClient.ts";

const deletelogger = async (ctx: RouterContext) => {
  try {
    const logger = await db.collection(LOGGERCOLLECTION).findOne({
      loggerName: ctx.params.loggerName,
    });
    if (!logger) {
      ctx.response.status = 404;
      ctx.response.body = {
        msg: "Logger not found",
      };
      return;
    }
    await db.collection(LOGGERCOLLECTION).deleteOne({
      loggerName: ctx.params.loggerName,
    });
    // check if ctx.params.loggerName exists in db.listCollectionNames
    if (ctx.params.loggerName in db.listCollections().map((c) => c.name)) {
      await db.collection(ctx.params.loggerName).drop();
    }
    if (logger.isFlushLogs) {
      const logflusherData = logger;
      logflusherData.operation = "delete";
      await sendLoggerToLogFlusherServer(logflusherData);
    }
    ctx.response.status = 200;
    ctx.response.body = {
      msg: "Logger deleted successfully",
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      msg: error.message,
    };
  }
};

export default deletelogger;
