import {log} from "../deps.ts";
import {SHINEWEBSOCKETPORT,SHINEWEBSOCKETHOST} from "../constants.ts";

const sendLogToWebSocketServer = (data:any) => {
    const websocket = new WebSocket(`ws://${SHINEWEBSOCKETHOST}:${SHINEWEBSOCKETPORT}/wss`+"?loggerName="+data.loggerName);
    websocket.onopen = () => {
        log.info("Internal Log Client Connected to WebSocketServer");
        websocket.send(JSON.stringify({
            channel: "message",
            message: data
        }));
        websocket.close();
    }
    websocket.onmessage = (m) => {
        log.info(`Got Message from WebSocketServer to Internal Log Client ${m.data}`);
    }
    websocket.onclose = () => {
        log.info("Internal Log Client Connection closed")
    }
}

export default sendLogToWebSocketServer;