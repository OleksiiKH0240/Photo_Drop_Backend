import { Router } from "express";
import userController from "../controllers/UserController";


const userRouter = Router();

userRouter.get("/getAll", userController.getAllUsers);

export default userRouter;
