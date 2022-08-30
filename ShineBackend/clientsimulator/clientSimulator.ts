const sendlogtoUI = () => {
  const websocket = new WebSocket(
    "ws://localhost/wss" + "?clientName=" + Deno.args[0],
  );
  websocket.onopen = () => {
    console.log("Connected to Server");
  };
  websocket.onmessage = (m) => {
    console.log("Got message from server to ShineUI CLient: ", m.data);
  };
  websocket.onclose = () => {
    console.log("Connection closed");
  };
};

window.onload = await sendlogtoUI();
