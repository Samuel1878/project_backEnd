import mongoose from "mongoose";
import bcrypt from "bcrypt";

const register = new mongoose.Schema({
  name: {
    type:String,
    required:true,
  },
  phone: {
    type:String,
    required:true,
  },
  password: {
    type:String,
    required:true,
  },
  chips: {
    type:Number,
    default:1000,
  },
  image: {
    type:String,
    default:"./img/user.png",
  }
}, {
    timestamps:true
});
// User.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// }
const User = mongoose.model("User", register);
export default User;