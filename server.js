const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const sockerIO = require("socket.io");
const http = require("http");

dotenv.config();

const app = express();

const httpServer = http.createServer(app);

const socketServer = sockerIO(httpServer, {
    cors:{
        origin:"*"
    }
})
app.use(express.json({extended:false}));
app.use("/api/users", userRoutes);



