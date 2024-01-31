import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq } from "drizzle-orm"
import albumClientRelations from "../schemas/albumClientRelations";


class AlbumClientRelationsRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    addAlbumClientRelations = async (albumId: number, clientsIds: number[]) => {
        for (const clientId of clientsIds) {
            await this.dbClient.insert(albumClientRelations).values({ albumId, clientId });
        }
    }

    getAlbumsByClientId = async (clientId: number) => {
        return await this.dbClient.select().from(albumClientRelations).where(eq(albumClientRelations.clientId, clientId))
    }

}

export default new AlbumClientRelationsRep();
