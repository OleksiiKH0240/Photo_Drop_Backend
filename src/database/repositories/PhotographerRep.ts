import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq, sql } from "drizzle-orm";
import photographers from "../schemas/photographers";
import albums from "../schemas/albums";
import photos from "../schemas/photos";
import albumClientRelations from "../schemas/albumClientRelations";
import photoClientRelations from "../schemas/photoClientRelations";
import fastCartesian from "fast-cartesian"
import albumPhotoRelations from "database/schemas/albumPhotoRelations";


class PhotographersRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(photographers).values([
            {
                photographerId: -1,
                username: "photographer1",
                password: "123456",
                email: "photographer1@gmail.com",
                fullname: "photographer1_fullname"
            },
            {
                photographerId: -2,
                username: "photographer2",
                password: "123456",
                email: "photographer2@gmail.com",
                fullname: "photographer2_fullname"
            },
        ]).onConflictDoNothing();
        console.log("test photographers were created successfully.");
    }

    hasPhotographerWithUsername = async (username: string) => {
        const photographer = await this.getPhotographerByUsername(username);
        return photographer === undefined ? false : true;
    }

    getPhotographerByUsername = async (username: string) => {
        return (await this.dbClient.select().from(photographers).where(eq(photographers.username, username)))[0];
    }

    addPhotographer = async (username: string, password: string, email?: string, fullname?: string) => {
        await this.dbClient.insert(photographers).values({ username, password, email, fullname });
    }

    addAlbum = async (albumName: string, albumLocation: string, photographerId: number) => {
        return await this.dbClient.insert(albums).values({ albumName, albumLocation, photographerId }).
            returning({ albumId: albums.albumId });
    }

    addAlbumClientRelations = async (albumId: number, clientsIds: number[]) => {
        for (const clientId of clientsIds) {
            await this.dbClient.insert(albumClientRelations).values({ albumId, clientId });
        }
    }

    getClientsIdsByAlbumId = async (albumId: number) => {
        return await this.dbClient.select({ clientId: albumClientRelations.clientId }).
            from(albumClientRelations).where(eq(albumClientRelations.albumId, albumId));
    }

    getAlbumById = async (albumId: number) => {
        return await this.dbClient.select().from(albums).where(eq(albums.albumId, albumId));
    }

    getAlbumsByPhotographerId = async (photographerId: number) => {
        return await this.dbClient.select({
            albumId: albums.albumId,
            albumName: albums.albumName,
            albumLocation: albums.albumLocation
        }).
            from(albums).
            where(eq(albums.photographerId, photographerId));
    }

    addPhotos = async (photoS3Keys: string[], watermarkPhotoS3Keys: string[]) => {
        const valsToInsert = photoS3Keys.map((photoS3Key, index) => ({
            photoS3Key,
            watermarkPhotoS3Key: watermarkPhotoS3Keys[index]
        }));
        return await this.dbClient.insert(photos).values(valsToInsert).onConflictDoNothing()
    }

    getPhotosByPhotoS3Keys = async (photoS3Keys: string[]) => {
        const result = await Promise.all(photoS3Keys.
            map(async photoS3Key =>
                (await this.dbClient.select().
                    from(photos).
                    where(eq(photos.photoS3Key, photoS3Key))
                )[0])
        );
        return result;
    }

    addAlbumPhotoRelations = async (albumId: number, photosIds: number[]) => {
        const valsToInsert = photosIds.map(el => ({ albumId, photoId: el }));
        await this.dbClient.insert(albumPhotoRelations).values(valsToInsert).onConflictDoNothing();
    }

    getPhotosByAlbumId = async (albumId: number) => {
        return await this.dbClient.select({
            photoId: photos.photoId,
            photoS3Key: photos.photoS3Key
        }).
            from(photos).
            innerJoin(albumPhotoRelations, eq(albumPhotoRelations.photoId, photos.photoId)).
            where(eq(albumPhotoRelations.albumId, albumId));
    }

    addPhotoClientRelations = async (photosIds: number[], clientsIds: number[]) => {
        const valsToInsert = fastCartesian([photosIds, clientsIds]).map(el => ({ photoId: el[0], clientId: el[1] }));
        await this.dbClient.insert(photoClientRelations).values(valsToInsert).onConflictDoNothing();
    }

}

export default new PhotographersRep();
