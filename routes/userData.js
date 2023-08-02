import express from "express";
import userData from "../controllers/userControl.js";
const userDataRouter = express.Router();

userDataRouter.get("/chip", userData.chip )
userDataRouter.get("/profileData", userData.profileData);
export default userDataRouter