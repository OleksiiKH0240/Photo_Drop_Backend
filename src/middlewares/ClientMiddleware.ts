import { Request, Response, NextFunction } from "express";


class ClientMiddleware {
    prepareAuthValidation = async (req: Request, res: Response, next: NextFunction) => {
        const username = req.query.username;
        if (username === undefined) {
            return res.status(400).json({ message: "username request query parameter is missed." });
        }
        next();
    }

    authValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { username, otp } = req.body;
        if (username === undefined || otp === undefined) {
            return res.status(400).json({ message: "username or otp request query parameters is missed." });
        }
        next();
    }
}

export default new ClientMiddleware();
