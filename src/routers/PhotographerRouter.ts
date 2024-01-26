import { Router } from "express";
import photographerController from "../controllers/PhotographerController";
import authenticate from "../middlewares/Authentication";


const photographerRouter = Router();

photographerRouter.get("/getAll", authenticate, photographerController.getAll);
photographerRouter.post("/signUp", photographerController.signUp);
photographerRouter.post("/logIn", photographerController.logIn);

export default photographerRouter;
