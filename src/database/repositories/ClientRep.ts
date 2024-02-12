import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { and, eq, max, sql } from "drizzle-orm"
import clients from "../schemas/clients";
import albumClientRelations from "../schemas/albumClientRelations";
import selfies from "../schemas/selfies";
import albums from "../schemas/albums";
import albumsPhotos from "../schemas/albumsPhotos";
import photoClientRelations from "database/schemas/photoClientRelations";


class ClientsRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(clients).values([
            {
                clientId: -1,
                username: "380963363207",
                otp: "123456",
                otpExpiredTimestamp: new Date(Date.now() + 3000),
                email: "client1@gmail.com",
                fullname: "client1_fullname"
            },
            {
                clientId: -2,
                username: "380963323507",
                otp: "123456",
                otpExpiredTimestamp: new Date(Date.now() + 5000),
                email: "client2@gmail.com",
                fullname: "client2_fullname"
            },
        ]).onConflictDoNothing();
        console.log("test clients were created successfully.");
    }

    getClientByUsername = async (username: string) => {
        return (await this.dbClient.select().from(clients).where(eq(clients.username, username)))[0];
    }

    hasClientWithUsername = async (username: string) => {
        const client = await this.getClientByUsername(username);
        return client === undefined ? false : true;
    }

    addClient = async (username: string, email?: string, fullname?: string) => {
        await this.dbClient.insert(clients).values({ username, email, fullname });
    }

    setClientOtp = async (username: string, otp: string, otpExpiredTimestamp: Date) => {
        await this.dbClient.update(clients).set({ otp, otpExpiredTimestamp }).where(eq(clients.username, username));
    }

    getAlbumsByClientId = async (clientId: number) => {
        return await this.dbClient.select().from(albumClientRelations).where(eq(albumClientRelations.clientId, clientId))
    }

    addSelfy = async (clientId: number, photoS3Key: string) => {
        await this.dbClient.insert(selfies).values({ clientId, photoS3Key }).onConflictDoNothing();
    }

    getSelfiesByClientId = async (clientId: number) => {
        return await this.dbClient.select().from(selfies).where(eq(selfies.clientId, clientId));
    }

    setClientNameEmail = async (clientId: number, fullname: string, email: string) => {
        await this.dbClient.update(clients).set({ fullname, email }).where(eq(clients.clientId, clientId));
    }

    setClientName = async (clientId: number, fullname: string) => {
        await this.dbClient.update(clients).set({ fullname }).where(eq(clients.clientId, clientId));
    }

    getAllAlbums = async (clientId: number) => {
        const unfilteredResult = this.dbClient.select({
            albumId: albums.albumId,
            albumName: albums.albumName,
            albumLocation: albums.albumLocation,
            lastPhotoId: sql<number>`max(${albumsPhotos.photoId}) over(partition by ${albums.albumId})`.as("last_photo_id"),
            photoId: albumsPhotos.photoId,
            photoS3Key: albumsPhotos.photoS3Key,
            isLocked: photoClientRelations.isLocked
        }).
            from(albumClientRelations).
            innerJoin(albums, eq(albums.albumId, albumClientRelations.albumId)).
            innerJoin(albumsPhotos, eq(albumsPhotos.albumId, albumClientRelations.albumId)).
            innerJoin(photoClientRelations, and(
                eq(photoClientRelations.photoId, albumsPhotos.photoId),
                eq(photoClientRelations.clientId, albumClientRelations.clientId),
            )).
            where(eq(albumClientRelations.clientId, clientId)).
            as("unfiltered_result");

        const result = await this.dbClient.select({
            albumId: unfilteredResult.albumId,
            albumName: unfilteredResult.albumName,
            albumLocation: unfilteredResult.albumLocation,
            lastPhotoId: unfilteredResult.lastPhotoId,
            photoS3Key: unfilteredResult.photoS3Key,
            isLocked: unfilteredResult.isLocked
        }).
            from(unfilteredResult).
            where(eq(unfilteredResult.photoId, unfilteredResult.lastPhotoId));

        // const result = Object.groupBy(rawResult, ({ albumId }) => albumId);
        return result;
    }

    getAlbumById = async (clientId: number, albumId: number) => {
        const result = await this.dbClient.select({
            albumId: albums.albumId,
            albumName: albums.albumName,
            albumLocation: albums.albumLocation,
            photoId: albumsPhotos.photoId,
            photoS3Key: albumsPhotos.photoS3Key,
            watermarkPhotoS3Key: albumsPhotos.watermarkPhotoS3Key,
            isLocked: photoClientRelations.isLocked
        }).
            from(albumClientRelations).
            innerJoin(albums, eq(albums.albumId, albumClientRelations.albumId)).
            innerJoin(albumsPhotos, eq(albumsPhotos.albumId, albumClientRelations.albumId)).
            innerJoin(photoClientRelations, and(
                eq(photoClientRelations.photoId, albumsPhotos.photoId),
                eq(photoClientRelations.clientId, albumClientRelations.clientId),
            )).
            where(and(
                eq(albumClientRelations.clientId, clientId),
                eq(albums.albumId, albumId)
            ));

        return result;
    }

    getAllPhotos = async (clientId: number) => {
        return await this.dbClient.select({
            photoId: albumsPhotos.photoId,
            photoS3Key: albumsPhotos.photoS3Key,
            watermarkPhotoS3Key: albumsPhotos.watermarkPhotoS3Key,
            isLocked: photoClientRelations.isLocked
        }).from(photoClientRelations).
            innerJoin(albumsPhotos, eq(albumsPhotos.photoId, photoClientRelations.photoId)).
            where(eq(photoClientRelations.clientId, clientId));
    }

    unlockPhoto = async (clientId: number, photoId: number) => {
        await this.dbClient.update(photoClientRelations).set({ isLocked: false }).
            where(
                and(
                    eq(photoClientRelations.clientId, clientId),
                    eq(photoClientRelations.photoId, photoId)
                ));
    }
}

export default new ClientsRep();
