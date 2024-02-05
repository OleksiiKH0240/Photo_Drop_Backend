import { Request, Response, NextFunction } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client, BUCKET_NAME } from "../../config";
import jwtDataGetters from "../utils/jwtDataGetters";
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
        if (albumName === undefined || albumLocation === undefined || clientsIds === undefined) {
            return res.status(400).json({ message: "fields albumName or albumLocation or clientsIds are missed." })
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
        const albumId = Number(req.query.albumId);

        if (Number.isNaN(albumId)) {
            return res.status(400).json({ message: "albumId request query parameter is missed or is not integer type." })
        }

        if ((await photographerRep.getAlbumById(albumId)).length === 0) {
            return res.status(400).json({ message: "album with given albumId does not exist." })
        }

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

    uploadPhotos = multer({
        storage: multerS3({
            s3: s3Client,
            bucket: BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req: Request & { photoS3Keys: string[] }, file, cb) {
                const jwtToken = req.headers.authorization;
                const username = jwtDataGetters.getUsername(jwtToken!);

                const photoS3Key = `${username}/${file.originalname}`;

                if (req.photoS3Keys === undefined) {
                    req.photoS3Keys = [photoS3Key,];
                }
                else {
                    req.photoS3Keys.push(photoS3Key);
                }

                cb(null, photoS3Key)
            }
        })
    }).any();
}

export default new PhotographerMiddleware();
