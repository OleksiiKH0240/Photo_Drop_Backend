import jwt from "jsonwebtoken";
import clientRep from "../database/repositories/ClientRep";
import jwtDataGetters from "../utils/jwtDataGetters";
import { getBotUsername } from "./TelegramBotService"
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3Client } from "../config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "core-js";


class ClientService {
    prepareAuth = async (username: string) => {
        username = username.replace(/[^0-9]/g, "");
        const clientExists = await clientRep.hasClientWithUsername(username);
        if (!clientExists) {
            await clientRep.addClient(username);
        }

        const botUsername = await getBotUsername();
        const stage = process.env.STAGE || "dev"; // or it can be 'prod'
        const telegramBotLink = `https://t.me/${botUsername}?start=${stage}_${username}`;
        return { telegramBotLink };
    }

    auth = async (username: string, otp: string) => {
        username = username.replace(/[^0-9]/g, "");
        const client = await clientRep.getClientByUsername(username);
        if (client.otp === null) {
            return {
                isOtpNull: true,
                isOtpExpired: undefined,
                isOtpWrong: undefined,
                token: undefined
            }
        }

        // console.log("client.otpExpiredTimestamp", client.otpExpiredTimestamp?.getTime());
        if (client.otpExpiredTimestamp!.getTime() < new Date().getTime()) {
            return {
                isOtpNull: false,
                isOtpExpired: true,
                isOtpWrong: undefined,
                token: undefined
            }
        }

        if (client.otp !== otp) {
            return {
                isOtpNull: false,
                isOtpExpired: false,
                isOtpWrong: true,
                token: undefined
            }
        }

        const ttl = Number(process.env.JWT_TTL);
        const JWT_SECRET = String(process.env.JWT_SECRET);
        const token = jwt.sign(
            {
                username: client.username,
                clientId: client.clientId,
            },
            JWT_SECRET, { expiresIn: ttl });

        return {
            isOtpNull: false,
            isOtpExpired: false,
            isOtpWrong: false,
            token
        }

    }

    uploadSelfy = async (photoS3Keys: string[], token: string) => {
        const clientId = jwtDataGetters.getClientId(token);
        await clientRep.addSelfy(clientId, photoS3Keys[0]);
    }

    getSelfies = async (token: string) => {
        const clientId = jwtDataGetters.getClientId(token);
        const rawResult = await clientRep.getSelfiesByClientId(clientId);
        const result: {
            selfyId: number,
            photoS3Key: string,
            clientId: number,
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

    setNameEmail = async (name: string, email: string, token: string) => {
        const clientId = jwtDataGetters.getClientId(token);

        await clientRep.setClientNameEmail(clientId, name, email);
    }

    setName = async (name: string, token: string) => {
        const clientId = jwtDataGetters.getClientId(token);

        await clientRep.setClientName(clientId, name);
    }

    getAlbumsPhotos = async (token: string) => {
        const clientId = jwtDataGetters.getClientId(token);

        const albumsPhotosRaw = await clientRep.getAlbumsPhotos(clientId);

        const albumsPhotosMap = Map.groupBy(albumsPhotosRaw, ({ albumId }) => albumId);
        let albumId, albumName, albumLocation, album;
        const albumsPhotos = [];

        for (const albumPhotos of albumsPhotosMap.values()) {
            ({ albumId, albumName, albumLocation } = albumPhotos[0]);
            album = {
                albumId, albumName, albumLocation,
                photos: await Promise.all(albumPhotos.map(async ({ photoId, photoS3Key, isLocked }) => {
                    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: photoS3Key });
                    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
                    return { photoId, photoS3Key, signedUrl, isLocked };
                }))
            }

            albumsPhotos.push(album);
        }

        return albumsPhotos;
    }

    unlockPhoto = async (token: string, photoId: number) => {
        const clientId = jwtDataGetters.getClientId(token);
        await clientRep.unlockPhoto(clientId, photoId);
    }

}

export default new ClientService();
