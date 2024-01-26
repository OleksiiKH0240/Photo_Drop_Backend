import { Router } from "express";
import clientController from "../controllers/ClientController";

const clientRouter = Router();

clientRouter.get("/getAll", clientController.getClients);

export default clientRouter;
