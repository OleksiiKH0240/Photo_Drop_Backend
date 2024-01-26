import { Request, Response, NextFunction } from "express";
import userRep from "../database/repositories/UserRep";


class UserController {
    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allUsers = await userRep.getUsers();
            res.status(200).json(allUsers);
        }
        catch (error) {
            next(error);
        }
    }
}

export default new UserController();
