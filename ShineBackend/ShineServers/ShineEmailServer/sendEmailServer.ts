import sendEmail from "./sendEmail.ts";
import  logging  from "../Shared/logsHandler.ts";
import { WebSocketClient } from "../Shared/deps.ts";

const sendEmailSocketClientConnect = () => {
  // WebSocketClient
  const client = new WebSocketClient(
    `ws://shine_api_gateway:8502/wss?clientName=sendEmailServer`,
  );

  client.onopen = () => {
    logging.info("ShineEmail Client connected to server");
  };

  client.onmessage = async (m) => {
    logging.info(
      `Got message from WebSocketserver to ShineEmail Client: ${m.data}`,
    );
    const data = await JSON.parse(JSON.parse(m.data).message);
    const emailSend = await sendEmail(data);
    logging.info(emailSend.msg);
  };

  client.onclose = () => {
    logging.warning("ShineEmail Client Connection closed, Reconnecting");
    setTimeout(function () {
      sendEmailSocketClientConnect();
    }, 1000);
  };

  client.onerror = () => {
    logging.error("ShineEmail Client Connection error,Connection closed");
    client.close();
  };
};

await sendEmailSocketClientConnect();
