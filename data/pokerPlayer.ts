const PokerTable = require("./pokerTable.js");
const jwt = require('jsonwebtoken');
const User = require("../models/User.js");
const logger = require("../log/logger.js");
//game Logic of each player in streaming action
export class PokerPlayer {
    constructor(sockerio, gameSocket) {
        this.socketio = socketio;
        this.gameSocket = gameSocket;
        this.currentTable = undefined;
        this.currentSit = undefined;
        this.user = undefined;
        gameSocket.on('disconnect', this.disconnectFromTable);
        gameSocket.on('leaveTable', this.disconnectFromTable);

        gameSocket.on("createTable", this.currentTable);
        gameSocket.on("joinTable", this.joinActiveTable);
        gameSocket.on("sitTable", this.sitTable);
        gameSocket.on("foldTable", this.foldTable);
        gameSocket.on("checkTable", this.checkTable);
        gameSocket.on("raiseTable", this.raiseTable);
        gameSocket.on("betTable", this.raiseTable);
        gameSocket.on('callTable', this.callTable);
        
        this.setupVideoChat();
    }
    setupVideoChat = () => {
        this.gameSocket.on('videoCallTable', data => {
            logger.tip(`${data.id}: made a video call`);
            this.socketio.to(data.userTocall).emit('callIncoming', {
                signal: data.signalData,
                from: data.from
            })

        })
        this.gameSocket.on("acceptCall", (data) => {
            logger.tip(`call accepted by: ${data.id}`);
            this.socketio.to(data.to).emit('callAccepted', data.signal)
        });
    }

//Table SETUP 
    joinActiveTable = data => {
        this.disconnectFromTable();
        var {tableId} = data;

        var tableRoom = this.socketio.sockets.adapter.roms.get(tableId);
        var table = activeTables[tableId];
        if (!tableRoom || !table) {
            this.gameSocket.emit('status', 'Unknown poker table')

        }
        if (table.joinTable(this)){
            
        }
    }

}