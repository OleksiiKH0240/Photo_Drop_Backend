import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import photographerRep from "../database/repositories/PhotographerRep";
import jwtDataGetters from "../utils/jwtDataGetters";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config";
import { generateSignedPhotos, generateSignedUrl } from "utils/s3Bucket";
import sharp from "sharp";


class PhotographerService {
    signUp = async (username: string, password: string, email?: string, fullname?: string) => {
        if (!(await photographerRep.hasPhotographerWithUsername(username))) {
            const saltRounds = Number(process.env.SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await photographerRep.addPhotographer(username, hashedPassword, email, fullname);

            return {
                photographerExists: false
            }
        }
        else {
            return {
                photographerExists: true
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
                    photographerExists: true,
                    isPasswordValid: true,
                    token
                }
            }
            else {
                return {
                    photographerExists: true,
                    isPasswordValid: false,
                    token: undefined
                }
            }
        }
        else {
            return {
                photographerExists: false,
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

        // const svg = `<svg
        // xmlns="http://www.w3.org/2000/svg" 
        // xml:lang="en"
        // height="40"
        // width="200">
        // <text
        // font-style="italic"
        // x="60" y="25" font-size="16" fill="#fff">
        // Photo Drop
        // </text></svg>`;
        // const watermark = sharp(Buffer.from(svg));
        // console.time("add watermark");
        // await Promise.all(photoS3Keys.map(async (photoS3Key) => {

        //     const getCommand = new GetObjectCommand({
        //         Bucket: BUCKET_NAME,
        //         Key: photoS3Key
        //     });

        //     const response = await s3Client.send(getCommand);
        //     const photoArray = await response.Body?.transformToByteArray();
        //     const photo = sharp(photoArray);

        //     const { width, height } = await photo.metadata();
        //     const watermarkPhotoBuffer = await photo.
        //         composite([{
        //             input: await watermark.resize(width, height).toBuffer(),
        //             gravity: "center"
        //         }]).toBuffer();

        //     const putCommand = new PutObjectCommand({
        //         Bucket: BUCKET_NAME,
        //         Key: photoS3Key.replace("withoutWatermark/", "withWatermark/"),
        //         Body: watermarkPhotoBuffer
        //     });
        //     await s3Client.send(putCommand);
        // }))
        // console.timeEnd("add watermark");

        const watermarkPhotoS3Keys = photoS3Keys.map(
            (photoS3Key) => photoS3Key.replace("withoutWatermark/", "withWatermark/")
        );

        // console.time("add photos to album, get photos ids");
        let photoIds = (await photographerRep.addPhotosToAlbum(albumId, photoS3Keys, watermarkPhotoS3Keys)).map(el => el.photoId);
        // console.log("photoIds", photoIds);
        if (photoIds.length === 0) {
            photoIds = (await photographerRep.getPhotosByAlbumId(albumId)).map(el => el.photoId);
        }
        // console.timeEnd("add photos to album, get photos ids");

        // console.time("get clients ids");
        const clientIds = (await photographerRep.getClientsIdsByAlbumId(albumId)).map(el => el.clientId);
        // console.timeEnd("get clients ids");

        // console.log(photoIds, clientIds);
        // console.time("add photo client rel");
        await photographerRep.addPhotoClientRelations(photoIds, clientIds)
        // console.timeEnd("add photo client rel");

    }

    addClientsToPhotos = async (clientsIds: number[], photosIds: number[]) => {
        await photographerRep.addPhotoClientRelations(photosIds, clientsIds);
    }

    getPhotosByAlbumId = async (albumId: number) => {
        const rawResult = await photographerRep.getPhotosByAlbumId(albumId);
        const result: {
            photoS3Key: string,
            signedUrl: string
        }[] = [];

        for (const el of rawResult) {
            const { photoS3Key, } = el;
            const signedUrl = await generateSignedUrl(photoS3Key);
            result.push({ ...el, signedUrl });
        }

        return result;
    }


}

export default new PhotographerService();
