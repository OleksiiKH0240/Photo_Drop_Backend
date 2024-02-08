import { Request, Response, NextFunction } from "express";
import clientService from "../services/ClientService";
import { authInputType } from "../types/ClientControllerTypes"


class ClientController {
    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, otp }: authInputType = req.body;
            const { isOtpNull, isOtpExpired, isOtpWrong, token } = await clientService.auth(username, otp);
            if (isOtpNull) {
                return res.status(401).json(
                    { message: "It seems like one-time password haven't been created yet, use telegram bot to generate it." })
            }

            if (isOtpExpired) {
                return res.status(401).json(
                    { message: "one-time password has expired." })
            }

            if (isOtpWrong) {
                return res.status(401).json(
                    { message: "one-time password is wrong." })
            }

            return res.setHeader("authorization", token!).status(200).json(
                {
                    token,
                    message: "client is successfully authenticated."
                })

        }
        catch (error) {
            next(error);
        }
    }

    prepareAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const username = String(req.query.username);
            const { telegramBotLink } = await clientService.prepareAuth(username);
            res.status(200).json({ telegramBotLink });
        }
        catch (error) {
            next(error);
        }
    }

    getClient = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!;

            const client = await clientService.getClient(token);

            res.status(200).json(client);
        }
        catch (error) {
            next(error);
        }
    }

    uploadSelfy = async (req: Request & { photoS3Keys?: string[] }, res: Response, next: NextFunction) => {
        try {
            if (req.files === undefined) {
                return res.status(400).json({ message: "no selfies were specified." });
            }

            const photoS3Keys = req.photoS3Keys!;
            const token = req.headers.authorization!;
            await clientService.uploadSelfy(photoS3Keys, token);

            res.status(200).json({ message: "selfy was uploaded successfully." })
        }
        catch (error) {
            next(error);
        }
    }

    getSelfies = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!;

            const selfies = await clientService.getSelfies(token);
            res.status(200).json(selfies);
        }
        catch (error) {
            next(error);
        }
    }

    setNameEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email }: { [key: string]: string } = req.body;
            const token = req.headers.authorization!;

            await clientService.setNameEmail(name, email, token);
            res.status(200).json({ message: "name and email was set." })
        }
        catch (error) {
            next(error);
        }
    }

    setName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const token = req.headers.authorization!;

            await clientService.setName(name, token);
            res.status(200).json({ message: "name was set." })
        }
        catch (error) {
            next(error);
        }
    }

    getAllAlbums = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!;

            const albumsPhotos = await clientService.getAllAlbums(token);
            res.status(200).json(albumsPhotos);
        }
        catch (error) {
            next(error);
        }
    }

    getAlbumById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const albumId = Number(req.query.albumId);
            const token = req.headers.authorization!;

            const album = await clientService.getAlbumById(token, albumId);
            res.status(200).json(album);
        }
        catch (error) {
            next(error);
        }
    }

    getAllPhotos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!;

            const photos = await clientService.getAllPhotos(token);
            res.status(200).json(photos);
        }
        catch (error) {
            next(error);
        }
    }

    unlockPhoto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!;
            const photoId = Number(req.query.photoId);
            await clientService.unlockPhoto(token, photoId);

            res.status(200).json({ message: `photo with id: ${photoId} successfully unlocked.` });
        }
        catch (error) {
            next(error);
        }
    }
}

export default new ClientController();
