import { log } from "../../Shared/deps.ts";
import {
  SHINEWEBSOCKETHOST,
  SHINEWEBSOCKETPORT,
} from "../../Shared/constants.ts";

const sendLogToWebSocketServer = (data:any) => {
  const websocket = new WebSocket(
    `ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss` + "?clientName=" +
      data.loggerName,
  );
  websocket.onopen = () => {
    log.info("Internal Log Client Connected to WebSocketServer");
    websocket.send(JSON.stringify({
      channel: "message",
      message: data,
    }));
    websocket.close();
  };
  websocket.onclose = () => {
    log.info("Internal Log Client Connection closed");
  };
};

export default sendLogToWebSocketServer;
