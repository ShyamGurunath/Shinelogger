import { Server } from "../Shared/deps.ts";
import { SHINEWEBSOCKETHOST, SHINEWEBSOCKETPORT } from "../Shared/constants.ts";
import { log } from "../Shared/deps.ts";

const server = new Server({
  hostname: SHINEWEBSOCKETHOST,
  port: SHINEWEBSOCKETPORT as number,
  protocol: "ws",
  path: "/wss",
});

server.on("connect", (e) => {
  log.info(`New Client Connected to WebSocket Server ${e.detail.id}`);
  const client = server.clients.get(e.detail.id);
  client!.uuid = e.detail.queryParams.get("clientName")!;
  log.info(`UUID Updated for client ${e.detail.id}  - ${client!.uuid}`); // intellisense helps you here
});

server.on("disconnect", (e) => {
  log.info(`Client ${e.detail.id} is Disconnected`); // intellisense helps you here
});

server.on("message", (e) => {
  server.clients.forEach((client) => {
    if (client.uuid as string === (e.detail.packet.loggerName! as string)) {
      log.info(`Sending Message to Client ${client.uuid}`);
      server.to("message", e.detail.packet as string, client.id);
    }
  });
});

server.on("logFlusher", (e) => {
  server.clients.forEach((client) => {
    if (client.uuid === "logFlusher") {
      log.info(`Sending Message to logFlusher Client ${client.uuid}`);
      server.to("logFlusher", e.detail.packet as string, client.id);
    }
  });
});

server.on("sendEmailServer", (e) => {
  server.clients.forEach((client) => {
    if (client.uuid === "sendEmailServer") {
      log.info(`Sending Message to SendEmail Client ${client.uuid}`);
      server.to("sendEmailServer", e.detail.packet as string, client.id);
    }
  });
});

server.run();

log.info(
  `Shine WebSocket Server Started on ${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}`,
);
