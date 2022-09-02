import { log } from "../../Shared/deps.ts";
import {
  SHINEWEBSOCKETHOST,
  SHINEWEBSOCKETPORT,
} from "../../Shared/constants.ts";

const sendLogToEmailServer = (data:any) => {
  const websocket = new WebSocket(
    `ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss?clientName=sendEmailServer`,
  );
  websocket.onopen = () => {
    log.info(`Log Created`);
    websocket.send(JSON.stringify({
      channel: "sendEmailServer",
      message: data,
    }));
    websocket.close();
  };
  websocket.onmessage = (m) => {
    log.info(m.data);
  };
  websocket.onclose = () => {
    log.info("SendEmailServer Client Connection closed");
  };
};

export default sendLogToEmailServer;
