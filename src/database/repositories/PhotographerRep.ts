import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq } from "drizzle-orm"
import photographers from "../schemas/photographers";
import users from "../schemas/users";


class PhotographersRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(photographers).values([
            { photographerId: -1, userId: -2 },
        ]).onConflictDoNothing();
        console.log("test photographers were created successfully.");
    }

    getPhotographers = async () => {
        return await this.dbClient.select({
            photographerId: photographers.photographerId,
            userId: photographers.userId,
        }).from(photographers);
    }

    addPhotographer = async (userId: number) => {
        await this.dbClient.insert(photographers).values({ userId });
    }
}

export default new PhotographersRep();
