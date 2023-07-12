import express from "express";
import registerController from "../controllers/registerController.js";
const registerRouter = express.Router();

registerRouter.post("/2faValidation", registerController.validationOTP);
export default registerRouter;