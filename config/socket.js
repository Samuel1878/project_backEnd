import {Server} from "socket.io";


const socketServer = (server) => {
    const io = new Server(server);
    return io;
}
export default socketServer;