import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq } from "drizzle-orm"
import albums from "../schemas/albums";


class AlbumRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    addAlbum = async (albumName: string, albumLocation: string, photographerId: number) => {
        return await this.dbClient.insert(albums).values({ albumName, albumLocation, photographerId }).
        returning({ albumId: albums.albumId });
    }

    getAlbumsByPhotographerId = async (photographerId: number) => {
        return await this.dbClient.select().from(albums).where(eq(albums.photographerId, photographerId))
    }

}

export default new AlbumRep();
