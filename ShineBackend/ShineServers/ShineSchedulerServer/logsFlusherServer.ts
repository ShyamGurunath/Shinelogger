import {
  enrollFlusher,
  enrollFlusherAtStart,
  removeFlusher,
  Schedulerlist,
  updateFlusher,
} from "./SchedulerClass.ts";
import { SHINEWEBSOCKETHOST, SHINEWEBSOCKETPORT } from "../Shared/constants.ts";
import { log, WebSocketClient } from "../Shared/deps.ts";

const flushLogsSocketClientConnect = () => {
  // WebSocketClient
  const client = new WebSocketClient(
    `ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss?clientName=logFlusher`,
  );

  client.onopen = () => {
    log.info("LogFlusher Client connected to server");
  };

  client.onmessage = async (m) => {
    log.info(`Got message from server to LogFlusher CLient:  ${m.data}`);
    const data = await JSON.parse(m.data).message;
    if (data.operation == "create") {
      log.info("Flushing log Create Operation, Creating a New Cron Job");
      await enrollFlusher(data.loggerName, data.flushIntervalCronExpression);
    }
    if (data.operation == "update") {
      if (data.isFlushLogs) {
        if (Schedulerlist.has(data.loggerName)) {
          log.info("Flushing log Update Operation");
          await updateFlusher(
            data.loggerName,
            data.flushIntervalCronExpression,
          );
        } else {
          log.info("Flushing log Update Operation,Creating a New Cron Job");
          await enrollFlusher(
            data.loggerName,
            data.flushIntervalCronExpression,
          );
        }
      } else {
        if (Schedulerlist.has(data.loggerName)) {
          log.info("Flushing log Update Operation,Removing Cron Job");
          await removeFlusher(data.loggerName);
        }
      }
    }
    if (data.operation == "delete") {
      if (Schedulerlist.has(data.loggerName)) {
        log.info("Flushing log Delete Operation,Removing Cron Job");
        await removeFlusher(data.loggerName);
      }
    }
  };

  client.onclose = () => {
    log.warning("LogFlusher client closed, Reconnecting");
    setTimeout(function () {
      flushLogsSocketClientConnect();
    }, 1000);
  };

  client.onerror = () => {
    log.error("LogFlusher Client Connection error,Connection closed");
    client.close();
  };
};

log.info("LogFlusher Server Started");
await enrollFlusherAtStart();
await flushLogsSocketClientConnect();
