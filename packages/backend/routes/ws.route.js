//@ts-check
import { WebSocketExpress, Router } from "websocket-express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { notifier } from "../utilities/notifier.js";

/**@type {Set<import("websocket-express").ExtendedWebSocket>} */
const clients = new Set();
const router = new Router();

notifier.on("order", (value) => {
  Array.from(clients).forEach((client) => {
    client.send(JSON.stringify(value));
  });
});

router.ws("/", authenticateToken, isAdmin, async (req, res) => {
  const ws = await res.accept();
  clients.add(ws);

  ws.addEventListener("close", () => {
    clients.delete(ws);
  });

  ws.addEventListener("error", (msg) => {
    console.log(msg);
    clients.delete(ws);
  });



});
//array of clients

export default router;
