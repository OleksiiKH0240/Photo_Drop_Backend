import { Router } from "express";
import clientController from "../controllers/ClientController";
import clientMiddleware from "../middlewares/ClientMiddleware";


const clientRouter = Router();

// clientRouter.get("/getAll", clientController.getClients);
clientRouter.get("/prepareAuth",
    clientMiddleware.prepareAuthValidation,
    clientController.prepareAuth)

clientRouter.post("/auth",
    clientMiddleware.authValidation,
    clientController.auth);

export default clientRouter;
