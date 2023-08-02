import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
const accountRouter = express.Router();

accountRouter.post("/2faValidation", registerController.validationOTP);
accountRouter.post("/createUser", registerController.createUser);
accountRouter.post("/login", loginController);


export default accountRouter;