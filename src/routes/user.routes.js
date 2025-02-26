import { Router } from "express";
import { loginUser, registerNewUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const userRouter = Router();

// here upload is nothing but a multer middleware that lets us handle images data
// upload.fields takes array of objects for multiple image inputs from frontend with different names
// if multiple images came with same name or under same name we would have used upload.array

userRouter.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerNewUser
);

userRouter.route("/login").post(loginUser);

export default userRouter;
