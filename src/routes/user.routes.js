import { Router } from "express";
import { registerNewUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerNewUser);

export default userRouter;
