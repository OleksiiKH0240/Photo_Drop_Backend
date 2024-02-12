import { Request, Response, NextFunction } from "express";
import { addClientsToPhotosType, authInputType, createAlbumInputType } from "../types/PhotographerControllerTypes";
import photographerService from "../services/PhotographerService";
import { BUCKET_NAME, s3Client } from "config";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";



class PhotographerController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password, email, fullname }: authInputType = req.body;
            const { photographerExists } = await photographerService.signUp(username, password, email, fullname);
            if (photographerExists === true) {
                return res.status(400).json({ message: "user with this username already exist. try another username." })
            }

            return res.status(200).json({
                message: "photographer was successfully signed up."
            })
        }
        catch (error) {
            next(error);
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password }: authInputType = req.body;

            const { photographerExists, isPasswordValid, token } = await photographerService.logIn(username, password);

            if (photographerExists === false) {
                return res.status(400).json({ message: "user with this username does not exist. try another username." });
            }

            if (photographerExists === true && isPasswordValid === false) {
                return res.status(401).json({ message: "password is invalid." })
            }

            if (photographerExists === true && isPasswordValid === true && token !== undefined) {
                res.setHeader("authorization", token).status(200).json({
                    token,
                    message: "photographer was logged in."
                });
            }
        }
        catch (error) {
            next(error);
        }
    }

    createAlbum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { albumName, albumLocation, clientsIds: clientsIds }: createAlbumInputType = req.body;
            const token = req.headers.authorization;
            const albumId = await photographerService.createAlbum(albumName, albumLocation, clientsIds, token!);
            res.status(200).json({ albumId, message: "album was added successfully." })
        }
        catch (error) {
            next(error);
        }
    }

    uploadPhotos = async (req: Request & { photoS3Keys?: string[] }, res: Response, next: NextFunction) => {
        try {
            // console.log(new Date().toUTCString(), new Date().getMilliseconds());
            // console.log(req.query);
            if (req.files === undefined) {
                return res.status(400).json({ message: "no files were uploaded." });
            }
            const albumId = Number(req.query.albumId);

            const photoS3Keys = req.photoS3Keys!;

            // console.time("service.uploadPhotos");
            await photographerService.uploadPhotos(albumId, photoS3Keys);
            // console.timeEnd("service.uploadPhotos");

            res.status(200).json({ message: `${req.files.length} files were uploaded successfully.` });
        }
        catch (error) {
            next(error);
        }
    }

    addClientsToPhotos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { clientsIds, photosIds }: addClientsToPhotosType = req.body;

            await photographerService.addClientsToPhotos(clientsIds, photosIds);
            res.status(200).json({ message: `clients: [${clientsIds}] was successfully added to photos: [${photosIds}].` });
        }
        catch (error) {
            next(error);
        }
    }

    getAllAlbums = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            const albums = await photographerService.getAllAlbums(token!);

            res.status(200).json(albums);
        }
        catch (error) {
            next(error);
        }
    }

    getPhotosByAlbumId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const albumId = Number(req.query.albumId);

            // console.time("service.getPhotos");
            const photoS3Key = await photographerService.getPhotosByAlbumId(albumId);
            // console.timeEnd("service.getPhotos");

            res.status(200).json(photoS3Key);
        }
        catch (error) {
            next(error);
        }
    }


}

export default new PhotographerController();
