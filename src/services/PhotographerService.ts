import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import photographerRep from "../database/repositories/PhotographerRep";
import jwtDataGetters from "../utils/jwtDataGetters";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../../config";


class PhotographerService {
    signUp = async (username: string, password: string, email?: string, fullname?: string) => {
        if (!(await photographerRep.hasPhotographerWithUsername(username))) {
            const saltRounds = Number(process.env.SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await photographerRep.addPhotographer(username, hashedPassword, email, fullname);

            return {
                isPhotographerExists: false
            }
        }
        else {
            return {
                isPhotographerExists: true
            }
        }

    }

    logIn = async (username: string, password: string) => {
        const photographer = await photographerRep.getPhotographerByUsername(username);
        if (photographer !== undefined) {
            let isPasswordValid: boolean;
            if (photographer.password.match(/^\d+/) !== null) {
                // test users case
                isPasswordValid = photographer.password === password ? true : false;
            }
            else {
                isPasswordValid = await bcrypt.compare(password, photographer.password);
            }

            if (isPasswordValid) {
                const ttl = Number(process.env.JWT_TTL);
                const JWT_SECRET = String(process.env.JWT_SECRET);
                const token = jwt.sign(
                    {
                        username: photographer.username,
                        photographerId: photographer.photographerId,
                    },
                    JWT_SECRET, { expiresIn: ttl });
                return {
                    isPhotographerExists: true,
                    isPasswordValid: true,
                    token
                }
            }
            else {
                return {
                    isPhotographerExists: true,
                    isPasswordValid: false,
                    token: undefined
                }
            }
        }
        else {
            return {
                isPhotographerExists: false,
                isPasswordValid: undefined,
                token: undefined
            }
        }
    }

    createAlbum = async (albumName: string, albumLocation: string, clientsIds: number[], token: string) => {
        const photographerId = jwtDataGetters.getPhotographerId(token);
        const { albumId } = (await photographerRep.addAlbum(albumName, albumLocation, photographerId))[0];
        await photographerRep.addAlbumClientRelations(albumId, clientsIds);
        return albumId;
    }

    getAllAlbums = async (token: string) => {
        const photographerId = jwtDataGetters.getPhotographerId(token);
        const albums = await photographerRep.getAlbumsByPhotographerId(photographerId);
        return albums;
    }

    uploadPhotos = async (albumId: number, photoS3Keys: string[]) => {
        // console.time("add photos to album, get photos ids");
        let photoIds = (await photographerRep.addPhotosToAlbum(albumId, photoS3Keys)).map(el => el.photoId);
        if (photoIds.length === 0) {
            photoIds = (await photographerRep.getPhotosByAlbumId(albumId)).map(el => el.photoId);
        }
        // console.timeEnd("add photos to album, get photos ids");

        // console.time("get clients ids");
        const clientIds = (await photographerRep.getClientsIdsByAlbumId(albumId)).map(el => el.clientId);
        // console.timeEnd("get clients ids");
        // console.log("photoIds", photoIds);

        // console.time("add photo client rel");
        photographerRep.addPhotoClientRelations(photoIds, clientIds)
        // console.timeEnd("add photo client rel");

    }

    getPhotosByAlbumId = async (albumId: number) => {
        const rawResult = await photographerRep.getPhotosByAlbumId(albumId);
        const result: {
            photoS3Key: string,
            isAlbumIcon: boolean,
            signedUrl: string
        }[] = [];

        for (const el of rawResult) {
            const { photoS3Key, } = el;
            const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: photoS3Key });
            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
            result.push({ ...el, signedUrl });
        }

        return result;
    }
}

export default new PhotographerService();
