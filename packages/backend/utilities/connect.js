const ws = new WebSocket("ws://localhost:3000/api/ws");
ws.addEventListener("open", () => {
  console.log("lesgooooooooo");
});

ws.addEventListener("message", (event) => {
    console.log(event.data);
  });

ws.addEventListener("error", (ep) => {
  console.log(ep);
  console.log("error");
});
