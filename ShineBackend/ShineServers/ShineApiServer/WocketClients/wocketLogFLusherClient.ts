import { log } from "../../Shared/deps.ts";
import {
  SHINEWEBSOCKETHOST,
  SHINEWEBSOCKETPORT,
} from "../../Shared/constants.ts";

const sendLoggerToLogFlusherServer = (data) => {
  const websocket = new WebSocket(
    `ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss?clientName=logFlusher`,
  );
  websocket.onopen = () => {
    log.info(`LogFlusherClient: Client connected to server`);
    websocket.send(JSON.stringify({
      channel: "logFlusher",
      message: data,
    }));
    websocket.close();
  };
  websocket.onclose = () => {
    log.info("logFlusher Client Connection closed");
  };
};

export default sendLoggerToLogFlusherServer;
