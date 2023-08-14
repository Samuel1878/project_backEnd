import logger from "../../log/logger.js";

class Room {
    constructor(){
        this.tables = []
    }
    createTable(socketId, table) {
        this.tables.push({roomId:socketId, table:table})
    }
    deleteTable(tableId) {
       this.tables = this.tables.filter((table)=>table.tableId !== tableId);
       logger.debug(this.tables)
    }
}
export default Room