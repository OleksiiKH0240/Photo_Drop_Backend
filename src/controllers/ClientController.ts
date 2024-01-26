import { Request, Response, NextFunction } from "express";
import clientRep from "../database/repositories/ClientRep";


class ClientController {
    getClients = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clients = await clientRep.getClients();
            res.status(200).json(clients);
        }
        catch (error) {
            next(error);
        }
    }
}

export default new ClientController();
