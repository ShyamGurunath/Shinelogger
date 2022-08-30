import sendEmail from "./sendEmail.ts";
import { log } from "../Shared/deps.ts";
import { WebSocketClient } from "../Shared/deps.ts";

const sendEmailSocketClientConnect = () => {
  // WebSocketClient
  const client = new WebSocketClient(
    `ws://shine_api_gateway/wss?clientName=sendEmailServer`,
  );

  client.onopen = () => {
    log.info("ShineEmail Client connected to server");
  };

  client.onmessage = async (m) => {
    log.info(
      `Got message from WebSocketserver to ShineEmail Client: ${m.data}`,
    );
    const data = await JSON.parse(JSON.parse(m.data).message);
    const emailSend = await sendEmail(data);
    log.info(emailSend.msg);
  };

  client.onclose = () => {
    log.warning("ShineEmail Client Connection closed, Reconnecting");
    setTimeout(function () {
      sendEmailSocketClientConnect();
    }, 1000);
  };

  client.onerror = () => {
    log.error("ShineEmail Client Connection error,Connection closed");
    client.close();
  };
};

await sendEmailSocketClientConnect();
