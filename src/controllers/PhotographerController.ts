import { Request, Response, NextFunction } from "express";
import photographerRep from "../database/repositories/PhotographerRep";
import userRep from "../database/repositories/UserRep";
import albumRep from "../database/repositories/AlbumRep";
import albumClientRelationsRep from "../database/repositories/AlbumClientRelationsRep";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authInputType, createAlbumInputType } from "../types/PhotographerControllerTypes";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import jwtDataGetters from "../utils/jwtDataGetters";



class PhotographerController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password }: authInputType = req.body;
            if (!(await userRep.hasUserWithUsername(username))) {
                const saltRounds = Number(process.env.SALT_ROUNDS);
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const userRes = await userRep.addUser(1, username, hashedPassword);
                const userId = userRes[0].userId;
                await photographerRep.addPhotographer(userId);

                return res.status(200).json({
                    message: "photographer was successfully signed up."
                })
            }
            res.status(400).json({ message: "user with this username already exist. try another username." })

        }
        catch (error) {
            next(error);
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password }: authInputType = req.body;
            const user = await userRep.getUserByUsername(username);
            if (user !== undefined) {
                let isPasswordValid: boolean;
                if (user.password.match(/^\d+/) !== null) {
                    // test users case
                    isPasswordValid = user.password === password ? true : false;
                }
                else {
                    isPasswordValid = await bcrypt.compare(password, user.password);
                }

                if (isPasswordValid) {
                    const ttl = Number(process.env.JWT_TTL);
                    const JWT_SECRET = String(process.env.JWT_SECRET);
                    const token = jwt.sign({ username: user.username, roleId: user.userRoleId }, JWT_SECRET, { expiresIn: ttl });
                    res.setHeader("authorization", token).status(200).json({
                        token,
                        message: "photographer was logged in."
                    });
                    // res.status(200).json({
                    //     token,
                    //     message: "photographer was logged in."
                    // });
                }
                else {
                    res.status(400).json({ message: "password is invalid." })
                }
            }
            else {
                res.status(400).json({ message: "user with this username does not exist. try another username." })
            }
        }
        catch (error) {
            next(error);
        }
    }

    createAlbum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { albumName, albumLocation, clientsIds, photographerId }: createAlbumInputType = req.body;
            const { albumId } = (await albumRep.addAlbum(albumName, albumLocation, photographerId))[0];
            await albumClientRelationsRep.addAlbumClientRelations(albumId, clientsIds);
            res.status(200).json({ albumId, message: "album was added successfully." })
        }
        catch (error) {
            next(error);
        }
    }

    uploadPhotos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.headers);
            console.log("files", req.files);
            if (req.files === undefined) {
                return res.status(400).json({ message: "no files were uploaded." })
            }
            const jwtToken = req.headers.authorization;
            let username = "unknown_user";
            if (jwtToken !== undefined) {
                username = jwtDataGetters.getUsername(jwtToken);
            }
            
            
            for (const file of Object.values(req.files)) {
                const key = file.originalname;
            }

            res.sendStatus(200);
        }
        catch (error) {
            next(error);
        }
    }

    uploadPhotoToS3 = async (key: string, body: Buffer, contentType: string) => {
        const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY!;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
        const BUCKET_NAME = process.env.BUCKET_NAME!;
        const BUCKET_REGION = process.env.BUCKET_REGION!;

        const s3Client = new S3Client({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            },
            region: BUCKET_REGION
        });

        const params: PutObjectCommandInput = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: contentType
        };
        const command = new PutObjectCommand(params);

        await s3Client.send(command);
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const photographers = await photographerRep.getPhotographers();
            res.status(200).json(photographers);
        }
        catch (error) {
            next(error);
        }
    }
}

export default new PhotographerController();
