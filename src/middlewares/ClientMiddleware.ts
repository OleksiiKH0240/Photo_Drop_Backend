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

    nameValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;
        if (name === undefined) {
            return res.status(400).json({ message: "name request query parameters is missed." });
        }
        next();
    }

    emailValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        if (email === undefined) {
            return res.status(400).json({ message: "email request query parameters is missed." });
        }
        next();
    }

    photoIdValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { photoId } = req.query;
        if (photoId === undefined || photoId === "" || Number.isNaN(Number(photoId))) {
            return res.status(400).json({ message: "photoId request query parameters is missed or is not integer." });
        }

        next();
    }

    albumIdValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { albumId } = req.query;
        if (albumId === undefined || albumId === "" || Number.isNaN(Number(albumId))) {
            return res.status(400).json({ message: "albumId request query parameters is missed or is not integer." });
        }

        next();
    }
}

export default new ClientMiddleware();
