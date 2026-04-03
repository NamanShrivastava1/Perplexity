import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/sockets/server.socket.js";

connectDB();

const httpServer = http.createServer(app);
initSocket(httpServer);


httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
