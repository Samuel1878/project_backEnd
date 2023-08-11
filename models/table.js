import mongoose from "mongoose";
const tables = new mongoose.Schema({
    tableId:{
        type:String,
        required:true
    },
    socketId:{
        type:String,
        required:true
    },
    limit:{
        type:Number,
        required:true
    }

})
export default tables