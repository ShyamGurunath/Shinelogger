import {
  enrollFlusher,
  enrollFlusherAtStart,
  removeFlusher,
  Schedulerlist,
  updateFlusher,
} from "./SchedulerClass.ts";
import { WebSocketClient } from "../Shared/deps.ts";
import  logging  from "../Shared/logsHandler.ts";

const flushLogsSocketClientConnect = () => {
  // WebSocketClient
  const client = new WebSocketClient(
    `ws://shine_api_gateway:8502/wss?clientName=logFlusher`,
  );

  client.onopen = () => {
    logging.info("LogFlusher Client connected to server");
  };

  client.onmessage = async (m) => {
    logging.info(`Got message from server to LogFlusher CLient:  ${m.data}`);
    const data = await JSON.parse(m.data).message;
    if (data.operation == "create") {
      logging.info("Flushing log Create Operation, Creating a New Cron Job");
      await enrollFlusher(data.loggerName, data.flushIntervalCronExpression);
    }
    if (data.operation == "update") {
      if (data.isFlushLogs) {
        if (Schedulerlist.has(data.loggerName)) {
          logging.info("Flushing log Update Operation");
          await updateFlusher(
            data.loggerName,
            data.flushIntervalCronExpression,
          );
        } else {
          logging.info("Flushing log Update Operation,Creating a New Cron Job");
          await enrollFlusher(
            data.loggerName,
            data.flushIntervalCronExpression,
          );
        }
      } else {
        if (Schedulerlist.has(data.loggerName)) {
          logging.info("Flushing log Update Operation,Removing Cron Job");
          await removeFlusher(data.loggerName);
        }
      }
    }
    if (data.operation == "delete") {
      if (Schedulerlist.has(data.loggerName)) {
        logging.info("Flushing log Delete Operation,Removing Cron Job");
        await removeFlusher(data.loggerName);
      }
    }
  };

  client.onclose = () => {
    logging.warning("LogFlusher client closed, Reconnecting");
    setTimeout(function () {
      flushLogsSocketClientConnect();
    }, 1000);
  };

  client.onerror = () => {
    logging.warning("LogFlusher Client Connection error,Connection closed");
    client.close();
  };
};

logging.info("LogFlusher Server Started");
setTimeout(async () => {
  await enrollFlusherAtStart();
},1000);
await flushLogsSocketClientConnect();
