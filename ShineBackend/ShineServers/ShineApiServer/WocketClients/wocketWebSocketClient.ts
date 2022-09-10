import  logging  from "../../Shared/logsHandler.ts";
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
    logging.info("Internal Log Client Connected to WebSocketServer");
    websocket.send(JSON.stringify({
      channel: "message",
      message: data,
    }));
    websocket.close();
  };
  websocket.onclose = () => {
    logging.info("Internal Log Client Connection closed");
  };
};

export default sendLogToWebSocketServer;
