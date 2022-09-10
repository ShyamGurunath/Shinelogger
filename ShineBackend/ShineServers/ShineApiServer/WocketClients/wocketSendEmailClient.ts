import  logging  from "../../Shared/logsHandler.ts";
import {
  SHINEWEBSOCKETHOST,
  SHINEWEBSOCKETPORT,
} from "../../Shared/constants.ts";

const sendLogToEmailServer = (data:any) => {
  const websocket = new WebSocket(
    `ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss?clientName=sendEmailServer`,
  );
  websocket.onopen = () => {
    logging.info(`Log Created`);
    websocket.send(JSON.stringify({
      channel: "sendEmailServer",
      message: data,
    }));
    websocket.close();
  };
  websocket.onmessage = (m) => {
    logging.info(m.data);
  };
  websocket.onclose = () => {
    logging.info("SendEmailServer Client Connection closed");
  };
};

export default sendLogToEmailServer;
