
import User from "../../../models/User.js";
import Table from "../Table.js";
import Player from "../Player.js";
import {
  FETCH_LOBBY_INFO,
  RECEIVE_LOBBY_INFO,
  PLAYERS_UPDATED,
  JOIN_TABLE,
  TABLE_JOINED,
  TABLES_UPDATED,
  LEAVE_TABLE,
  TABLE_LEFT,
  FOLD,
  CHECK,
  CALL,
  RAISE,
  TABLE_MESSAGE,
  SIT_DOWN,
  REBUY,
  STAND_UP,
  SITTING_OUT,
  SITTING_IN,
  DISCONNECT,
  TABLE_UPDATED,
  WINNER,
  CREATE_TABLE,
} from "../actions.js";
import { decodeToken } from "../../../config/generateToken.js";
import Room from "../Room.js";
import logger from "../../../log/logger.js";
const room = [];
const players = {};
const createNewTable = (id,socket,limit) => {
  const table = new Table(id,`table ${socket}`, limit);
  // room.createTable(socket, table);
  if(room.find((e)=>e.table.id === id)){
   return console.log(`table ${id} already exit`)
  }
  room.push({roomId:socket, table:table});
  logger.tip(room.length)
}
function deleteTableFromRoom (id){
  room = room.filter((e)=>e.table.id !== id)
}
function getCurrentPlayers(){
  return Object.values(players).map((player)=> ({
    socketId: player.socketId,
    id:player.id,
    name:player.name,
  }));
}
function getCurrentTables(tableId){
  return room.filter((table)=>table.table.id === tableId)
  // return Object.values(tables).map((table)=>({
  //   id:table.id,
  //   name:table.name,
  //   limit:table.limit,
  //   maxPlayers:table.maxPlayers,
  //   currentNumberPlayers: table.players.length,
  //   smallBlind: table.minBet,
  //   bigBlind: table.minBet *2,
  // }));
};
const currentTable = (tableId)=>{
  const [tableData] = getCurrentTables(tableId);
  const {roomId, table} = tableData;
  return {roomId, table}
}

const getTable = (table) => {
    return {
      id: table.id,
      name: table.name,
      limit: table.limit,
      maxPlayers: table.maxPlayers,
      currentNumberPlayers: table.players.length,
      smallBlind: table.minBet,
      bigBlind: table.minBet *2,
    };
}
const init = (socket, io)=>{
  socket.on(FETCH_LOBBY_INFO, async(token)=>{
    let user = decodeToken(token);
    if (user){
      const found = Object.values(players).find((player)=>{
        return player.id == user.id;
      });
      if(found){
        delete players[found.socketId];
        room.map((table)=>{
          table.removePlayer(found.socketId);
          broadcastToTable(table);
        });
      }
      user = await User.findById(user.id).select('-password');
      players[socket.id] = new Player(
        socket.id,
        user._id,
        user.name,
        user.chips,
      );
      socket.emit(RECEIVE_LOBBY_INFO, {
        tables: room,
        players:getCurrentPlayers(),
        socketId: socket.id,
      });
      socket.broadcast.emit(PLAYERS_UPDATED, getCurrentPlayers())
    }
  });
  socket.on(CREATE_TABLE, ({tableId,limit})=>{
      createNewTable(tableId, socket.id,limit);
      const player = players[socket.id];
      const {roomId, table} = currentTable(tableId);
      console.log(table);
      table.addPlayer(player);
      socket.emit(TABLE_JOINED, { 
        tables: getTable(table), 
        tableId ,socketId:roomId
      });
      socket.broadcast.emit(TABLES_UPDATED, getTable(table));
      if(table.players &&
        table.players.length>0 &&
        player){
          let message = `${player.name} created the table`;
          broadcastToTable(table, message);
        }
  });
  socket.on(JOIN_TABLE, (tableId)=>{
    //////This 
    if(room.find((e)=>e.table.id=== tableId)){
      const {roomId, table} = currentTable(tableId);
      const player = players[socket.id];
      table.addPlayer(player);
      socket.emit(TABLE_JOINED, { 
        tables: getTable(table), 
        tableId,socketId:roomId 
      });
      socket.broadcast.emit(TABLES_UPDATED, getTable(table));
      
      if(table.players &&
        table.players.length>0&& player){
          let message = `${player.name} joined the table`;
          broadcastToTable(table,message)
        }
    }
  });
  socket.on(LEAVE_TABLE, (tableId)=>{
    const {roomId, table } = currentTable(tableId);
    const player = players[socket.id];
    const seat = Object.values(table.seats).find(
      (seat)=> seat && seat.player.socketId === socket.id,
    );
    if(seat && player){
      updatePlayerBankroll(player, seat.stack);
    }
    table?.removePlayer(socket.id);
    socket.broadcast.emit(TABLES_UPDATED, getTable(table));
    socket.emit(TABLE_LEFT, {table:getTable(table), tableId});
    if(
      table.players &&
      table.players.length> 0 &&
      player
    ){
      let message = `${player.name} left the table.`;
      broadcastToTable(table, message,roomId);
    }
    if(table.activePlayers().length === 1){
      clearForOnePlayer(table);
    }
  });
 socket.on(FOLD, (tableId) => {
   let {roomId, table} = currentTable(tableId);
   let res = table.handleFold(socket.id);
   res && broadcastToTable(table, res.message);
   res && changeTurnAndBroadcast(table, res.seatId);
 });

 socket.on(CHECK, (tableId) => {
   let { roomId, table } = currentTable(tableId);
   let res = table.handleCheck(socket.id);
   res && broadcastToTable(table, res.message);
   res && changeTurnAndBroadcast(table, res.seatId);
 });

 socket.on(CALL, (tableId) => {
   let { roomId, table } = currentTable(tableId);
   let res = table.handleCall(socket.id);
   res && broadcastToTable(table, res.message);
   res && changeTurnAndBroadcast(table, res.seatId);
 });

 socket.on(RAISE, ({ tableId, amount }) => {
   let { roomId, table } = currentTable(tableId);
   let res = table.handleRaise(socket.id, amount);
   res && broadcastToTable(table, res.message);
   res && changeTurnAndBroadcast(table, res.seatId);
 });

 socket.on(TABLE_MESSAGE, ({ message, from, tableId }) => {
   let { roomId, table } = currentTable(tableId);
   broadcastToTable(table, message, from);
 });

 socket.on(SIT_DOWN, ({ tableId, seatId, amount }) => {
   const { roomId, table } = currentTable(tableId);
   const player = players[socket.id];

   if (player) {
     table.sitPlayer(player, seatId, amount);
     let message = `${player.name} sat down in Seat ${seatId}`;

     updatePlayerBankroll(player, -amount);

     broadcastToTable(table, message);
     if (table.activePlayers().length === 2) {
       initNewHand(table);
     }
   }
 });

 socket.on(REBUY, ({ tableId, seatId, amount }) => {
   let { roomId, table } = currentTable(tableId);
   const player = players[socket.id];

   table.rebuyPlayer(seatId, amount);
   updatePlayerBankroll(player, -amount);

   broadcastToTable(table);
 });

 socket.on(STAND_UP, (tableId) => {
   let {roomId, table} = currentTable(tableId);
   const player = players[socket.id];
   const seat = Object.values(table.seats).find(
     (seat) => seat && seat.player.socketId === socket.id
   );

   let message = "";
   if (seat) {
     updatePlayerBankroll(player, seat.stack);
     message = `${player.name} left the table`;
   }

   table.standPlayer(socket.id);

   broadcastToTable(table, message);
   if (table.activePlayers().length === 1) {
     clearForOnePlayer(table);
   }
 });

 socket.on(SITTING_OUT, ({ tableId, seatId }) => {
   let { roomId, table } = currentTable(tableId);
   const seat = table.seats[seatId];
   seat.sittingOut = true;

   broadcastToTable(table);
 });

 socket.on(SITTING_IN, ({ tableId, seatId }) => {
   let { roomId, table } = currentTable(tableId);
   const seat = table.seats[seatId];
   seat.sittingOut = false;

   broadcastToTable(table);
   if (table.handOver && table.activePlayers().length === 2) {
     initNewHand(table);
   }
 });

 socket.on(DISCONNECT, () => {
   const seat = findSeatBySocketId(socket.id);
   if (seat) {
     updatePlayerBankroll(seat.player, seat.stack);
   }

   delete players[socket.id];
   removeFromTables(socket.id);

   socket.broadcast.emit(TABLES_UPDATED, room);
   socket.broadcast.emit(PLAYERS_UPDATED, getCurrentPlayers());
 });

 async function updatePlayerBankroll(player, amount) {
   const user = await User.findById(player.id);
   user.chipsAmount += amount;
   await user.save();

   players[socket.id].bankroll += amount;
   io.to(socket.id).emit(PLAYERS_UPDATED, getCurrentPlayers());
 }

 function findSeatBySocketId(socketId) {
   let foundSeat = null;
  //  Object.values(tables).forEach((table) => {
  //    Object.values(table.seats).forEach((seat) => {
  //      if (seat && seat.player.socketId === socketId) {
  //        foundSeat = seat;
  //      }
  //    });
  //  });
  room.forEach((tableData)=>{
    let {roomId, table} = tableData;
    table.seats.forEach((seat)=>{
      if(seat && seat.player.socketId === socketId){
        foundSeat =seat;
      }
    })
  })
   return foundSeat;
 }

 function removeFromTables(socketId) {
  //  for (let i = 0; i < Object.keys(tables).length; i++) {
  //    tables[Object.keys(tables)[i]].removePlayer(socketId);
  //  }
  room.forEach((tableData)=>{
    let {roomId, table} = tableData;
    table.removePlayer(socketId);
  })
 }

 function broadcastToTable(table, message = null, from=null ) {
  console.log(message)
   for (let i = 0; i < table.players.length; i++) {
     let socketId = table.players[i].socketId;
     let tableCopy = hideOpponentCards(table, socketId);
     io.to(socketId).emit(TABLE_UPDATED, {
       table: tableCopy,
       message,
      from
     });
    
   }
 }

 function changeTurnAndBroadcast(table, seatId) {
   setTimeout(() => {
     table.changeTurn(seatId);
     broadcastToTable(table);

     if (table.handOver) {
       initNewHand(table);
     }
   }, 1000);
 }

 function initNewHand(table) {
   if (table.activePlayers().length > 1) {
     broadcastToTable(table, "---New hand starting in 5 seconds---");
   }
   setTimeout(() => {
     table.clearWinMessages();
     table.startHand();
     broadcastToTable(table, "--- New hand started ---");
   }, 5000);
 }

 function clearForOnePlayer(table) {
   table.clearWinMessages();
   setTimeout(() => {
     table.clearSeatHands();
     table.resetBoardAndPot();
     broadcastToTable(table, "Waiting for more players");
   }, 5000);
 }

 function hideOpponentCards(table, socketId) {
   let tableCopy = JSON.parse(JSON.stringify(table));
   let hiddenCard = { suit: "hidden", rank: "hidden" };
   let hiddenHand = [hiddenCard, hiddenCard];

   for (let i = 1; i <= tableCopy.maxPlayers; i++) {
     let seat = tableCopy.seats[i];
     if (
       seat &&
       seat.hand.length > 0 &&
       seat.player.socketId !== socketId &&
       !(seat.lastAction === WINNER && tableCopy.wentToShowdown)
     ) {
       seat.hand = hiddenHand;
     }
   }
   return tableCopy;
 }
}
export default init;