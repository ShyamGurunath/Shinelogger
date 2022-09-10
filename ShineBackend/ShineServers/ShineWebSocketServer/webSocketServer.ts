import { Server } from "../Shared/deps.ts";
import { SHINEWEBSOCKETHOST, SHINEWEBSOCKETPORT } from "../Shared/constants.ts";
import logging  from "../Shared/logsHandler.ts";

const server = new Server({
  hostname: SHINEWEBSOCKETHOST,
  port: parseInt(SHINEWEBSOCKETPORT),
  protocol: "ws",
  path: "/wss",
});

server.on("connect", (e) => {
  logging.info(`New Client Connected to WebSocket Server ${e.detail.id}`);
  const client = server.clients.get(e.detail.id);
  client!.uuid = e.detail.queryParams.get("clientName")!;
  logging.info(`UUID Updated for client ${e.detail.id}  - ${client!.uuid}`); // intellisense helps you here
});

server.on("disconnect", (e) => {
  logging.info(`Client ${e.detail.id} is Disconnected`); // intellisense helps you here
});

server.on("message", (e) => {
  server.clients.forEach((client) => {
    if (client.uuid as string === (e.detail.packet.loggerName as string)) {
      logging.info(`Sending Message to Client ${client.uuid}`);
      server.to("message", e.detail.packet as string, client.id);
    }
  });
});

server.on("logFlusher", (e) => {
  server.clients.forEach((client) => {
    if (client.uuid === "logFlusher") {
      logging.info(`Sending Message to logFlusher Client ${client.uuid}`);
      server.to("logFlusher", e.detail.packet as string, client.id);
    }
  });
});

server.on("sendEmailServer", (e) => {
  server.clients.forEach((client) => {
    if (client.uuid === "sendEmailServer") {
      logging.info(`Sending Message to SendEmail Client ${client.uuid}`);
      server.to("sendEmailServer", e.detail.packet as string, client.id);
    }
  });
});

server.run();

logging.info(
  `Shine WebSocket Server Started on ${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}`,
);
