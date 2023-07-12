import {Server} from "socket.io";
import logger from "../log/logger.js";

const socketServer = (server) => {
    const io = new Server(server);
    io.on("connection",(socket)=>{
        logger.info("socket connection connected by" + socket.id);
        socket.on("disconnect", (reason) => {
            logger.warn("The Main socket closed due to" + reason); // "ping timeout"
          });
    })
}
export default socketServer;