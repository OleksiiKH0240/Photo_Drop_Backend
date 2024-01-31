import { Request, Response, NextFunction } from "express";


class PhotographerMiddleware {
    authFieldsExistanceCheck = async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;
        if (username === undefined || password === undefined) {
            return res.status(400).json({ message: "fields username or password are missed." })
        }
        next();
    }

    usernameValidation = async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username;
        if (username.match(/^[A-Za-z_]+$/g) === null) {
            return res.status(400).json({ message: "username field is not valid." })
        }
        next();
    }

    albumFieldsExistanceCheck = async (req: Request, res: Response, next: NextFunction) => {
        const { albumName, albumLocation, clientsIds, photographerId } = req.body;
        if (albumName === undefined || albumLocation === undefined || clientsIds === undefined || photographerId === undefined) {
            return res.status(400).json({ message: "fields albumName or albumLocation or clientsIds or photographerId are missed." })
        }
        next();

    }
}

export default new PhotographerMiddleware();
