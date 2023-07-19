
import express from "express";
import * as dotenv from "dotenv";
import bodyparser from "body-parser";
import cors from "cors";
import http from "http";
import connectDB from "./config/database.js";
import accountRouter from "./routes/account.js";
import logger from "./log/logger.js";
import socketServer from "./config/socket.js";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyparser.json())
app.use(express.json({extended:false}));
app.use(cors())
app.use("/api/register", accountRouter);
connectDB();
socketServer(httpServer);


httpServer.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  logger.info(`A server is runing at ${process.env.PORT}`);
});



