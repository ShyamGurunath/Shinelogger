import {Server} from "../Shared/deps.ts";
import {SHINEWEBSOCKETHOST,SHINEWEBSOCKETPORT} from "../Shared/constants.ts";
import {log} from "../Shared/deps.ts";

const server = new Server({
    hostname: SHINEWEBSOCKETHOST,
    port: SHINEWEBSOCKETPORT ,
    protocol: "ws",
    path: "/wss",
});

server.on("connect", (e) => {
    log.info(`New Client Connected to WebSocket Server ${e.detail.id}`);
    const client = server.clients.get(e.detail.id);
    client.uuid = e.detail.queryParams.get("loggerName")
    log.info(`UUID Updated for client ${e.detail.id}  - ${client.uuid}`);// intellisense helps you here
});

server.on("disconnect", async (e) => {
    log.info(`Client ${e.detail.id} is Disconnected`); // intellisense helps you here
});

server.on("message", (e) => {
    server.clients.forEach((client) => {
        if (client.uuid === e.detail.packet.loggerName) {
            log.info(`Sending Message to Client ${client.uuid}`);
            server.to("message", e.detail.packet, client.id);
        }
    });
})

server.run()

log.info(`WebSocket Server Started on ${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}`);