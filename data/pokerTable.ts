const PokerPlayer = require("./pokerPlayer.js");
const poker = require("poker-ts");

const maxSeats = 2; 

export class PokerTable {
    constructor(socketio, tableId){
        this.socketio = socketio;
        this.tableId = tableId;
        this.players = [];

        this.table = poker.Table({
            ante: 0,
            smallBlind: 10,
            bigBlind:20,
        })
    }
    joinTable = PokerPlayer => {
        if (this.players.length < maxSeats) {
            this.players.push(PokerPlayer);
            return true;
        }
        return false;
    }
    updatePlayers = () =>{
        var {table,socketio} = this;
        var tableData = {
            seats: table.seats()
        }
        this.players.forEach(player=>{
            if(player.currentSeat !== undefined && player.user) {
                tableData.seats[player.currentSeat].name = player.user.name;
                tableData.seats[player.currentSeat].image = player.user.image;
                tableData.seats[player.currentSeat].socketId = player.user.socketId;
            }

        })
        if (table.isHandInProgress()){
            tableData['cards'] = table.holeCards();
            tableData['round'] = table.roundOfBetting();
            tableData['community'] = table.communityCards();
            tableData['pot'] = table.pots()[0].size;

            if (table.isBettingRoundInProgress()){
                tableData['active']
            }

        }
    }
}