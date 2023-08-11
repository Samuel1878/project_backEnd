import logger from "../../log/logger";

class Room {
    constructor(){
        this.table = []
    }
    createTable(socketId, tableId) {
        this.table.push({roomId:socketId, tableId:tableId})
    }
    deleteTable(tableId) {
       this.table = this.table.filter((id)=>id.tableId !== tableId);
       logger.debug(this.table)
    }
}
export default Room