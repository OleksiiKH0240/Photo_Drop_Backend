import { Request, Response, NextFunction } from "express";
import photographerRep from "../database/repositories/PhotographerRep";


class PhotographerMiddleware {
    authValidation = async (req: Request, res: Response, next: NextFunction) => {
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

    createAlbumValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { albumName, albumLocation, clientsIds } = req.body;
        if (albumName === undefined || albumLocation === undefined ||
            clientsIds === undefined || !Array.isArray(clientsIds)) {
            return res.status(400).json({ message: "fields albumName, albumLocation or clientsIds are missed." })
        }
        next();
    }

    addClientsToPhotosValidation = async (req: Request, res: Response, next: NextFunction) => {
        const { clientsIds, photosIds } = req.body;
        if (photosIds === undefined || !Array.isArray(photosIds) ||
            clientsIds === undefined || !Array.isArray(clientsIds)) {
            return res.status(400).json({ message: "fields photosIds, clientsIds are missed or have invalid type." })
        }
        next();
    }

    // getAlbumsByPhotographerIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    //     const photographerId = Number(req.query.photographerId);
    //     if (Number.isNaN(photographerId)) {
    //         return res.status(400).json({ message: "photographerId request query parameter is missed or is not integer type." })
    //     }
    //     next();
    // }

    uploadPhotosValidation = async (req: Request, res: Response, next: NextFunction) => {
        // console.log(new Date().toUTCString(), new Date().getMilliseconds());
        const albumId = Number(req.query.albumId);

        if (Number.isNaN(albumId)) {
            return res.status(400).json({ message: "albumId request query parameter is missed or is not integer type." })
        }

        if ((await photographerRep.getAlbumById(albumId)).length === 0) {
            return res.status(400).json({ message: "album with given albumId does not exist." })
        }
        // console.log(req);
        // console.log(new Date().toUTCString(), new Date().getMilliseconds());
        next();
    }

    albumIdValidation = async (req: Request, res: Response, next: NextFunction) => {
        // console.log("req.query", req.query);
        const albumId = Number(req.query.albumId);

        if (Number.isNaN(albumId)) {
            return res.status(400).json({ message: "albumId request query parameter is missed or is not integer type." })
        }
        next();
    }
}

export default new PhotographerMiddleware();
