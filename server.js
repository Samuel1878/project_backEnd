
import express from "express";
import * as dotenv from "dotenv";
import http from "http";
import connectDB from "./config/database.js";
import logger from "./log/logger.js";
import socketServer from "./config/socket.js";
import configRoutes from "./routes/index.js";
import middleware from "./middleware/index.js";
import init from "./data/pokerGame/socket/index.js";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
let db;
//middleware config
middleware(app)

//Set up Routes
configRoutes(app);

(async function(){
  db = await connectDB();
})()
//start server and listen for connections
httpServer.listen(process.env.PORT|| 80, (err) => {
  if (err) console.log(err);
  logger.info(`A server is runing at ${process.env.HOST, process.env.PORT}`);
});

//handle real-time poker game logic with socket.io
const io = socketServer(httpServer);
io.on('connection', (socket)=>{init(socket, io)});


//Error handling and close server
process.on('unhandledRejection', (err)=>{
  db.disconnect();
  logger.err(err.message);
  httpServer.close(()=>{
    process.exit(1);
  });
});


