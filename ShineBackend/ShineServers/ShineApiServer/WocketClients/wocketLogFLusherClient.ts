import  logging  from "../../Shared/logsHandler.ts";
import {
  SHINEWEBSOCKETHOST,
  SHINEWEBSOCKETPORT,
} from "../../Shared/constants.ts";

const sendLoggerToLogFlusherServer = (data:any) => {
  const websocket = new WebSocket(
    `ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss?clientName=logFlusher`,
  );
  websocket.onopen = () => {
    logging.info(`LogFlusherClient: Client connected to server`);
    websocket.send(JSON.stringify({
      channel: "logFlusher",
      message: data,
    }));
    websocket.close();
  };
  websocket.onclose = () => {
    logging.info("logFlusher Client Connection closed");
  };
};

export default sendLoggerToLogFlusherServer;
